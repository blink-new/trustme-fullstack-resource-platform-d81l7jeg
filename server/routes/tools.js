const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tools/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all tools (public)
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      type,
      isPremium,
      sort = 'newest',
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Premium filter
    if (isPremium !== undefined) {
      query.isPremium = isPremium === 'true';
    }
    
    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { usageCount: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const tools = await Tool.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Tool.countDocuments(query);
    
    res.json({
      tools,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured tools
router.get('/featured', async (req, res) => {
  try {
    const tools = await Tool.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6);
    
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tool categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Tool.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single tool (public)
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool || !tool.isActive) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Use tool (increment usage count)
router.post('/:id/use', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool || !tool.isActive) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    // Check if tool is premium and requires payment
    if (tool.isPremium && tool.price > 0) {
      const { paymentId, orderId, signature } = req.body;
      
      if (!paymentId || !orderId || !signature) {
        return res.status(400).json({ 
          message: 'Payment verification required for premium tool',
          tool: {
            id: tool._id,
            name: tool.name,
            price: tool.price,
            isPremium: tool.isPremium
          }
        });
      }

      // Verify Razorpay payment (implement this based on your Razorpay setup)
      // For now, we'll assume payment is verified
    }

    // Increment usage count
    await tool.incrementUsage();
    
    res.json({ 
      message: 'Tool usage recorded',
      tool: {
        id: tool._id,
        name: tool.name,
        type: tool.type,
        url: tool.url,
        embedCode: tool.embedCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Create tool
router.post('/', adminAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      type,
      url,
      embedCode,
      tags,
      features,
      price,
      isPremium,
      difficulty,
      estimatedTime,
      instructions
    } = req.body;

    const tool = new Tool({
      name,
      description,
      category,
      type,
      url,
      embedCode,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      features: features ? features.split(',').map(feature => feature.trim()) : [],
      price: parseFloat(price) || 0,
      isPremium: isPremium === 'true',
      difficulty,
      estimatedTime,
      instructions,
      thumbnailUrl: req.files.thumbnail ? `/uploads/tools/${req.files.thumbnail[0].filename}` : '',
      screenshots: req.files.screenshots ? req.files.screenshots.map(file => `/uploads/tools/${file.filename}`) : [],
      createdBy: req.user.userId
    });

    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update tool
router.put('/:id', adminAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.tags) {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    if (req.body.features) {
      updateData.features = req.body.features.split(',').map(feature => feature.trim());
    }
    
    if (req.body.isPremium) {
      updateData.isPremium = req.body.isPremium === 'true';
    }
    
    if (req.files.thumbnail) {
      updateData.thumbnailUrl = `/uploads/tools/${req.files.thumbnail[0].filename}`;
    }
    
    if (req.files.screenshots) {
      updateData.screenshots = req.files.screenshots.map(file => `/uploads/tools/${file.filename}`);
    }
    
    updateData.updatedBy = req.user.userId;
    
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete tool
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tools for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle tool status
router.patch('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    tool.isActive = !tool.isActive;
    tool.updatedBy = req.user.userId;
    await tool.save();
    
    res.json({ 
      message: `Tool ${tool.isActive ? 'activated' : 'deactivated'} successfully`,
      tool 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle featured status
router.patch('/:id/toggle-featured', adminAuth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    tool.isFeatured = !tool.isFeatured;
    tool.updatedBy = req.user.userId;
    await tool.save();
    
    res.json({ 
      message: `Tool ${tool.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      tool 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;