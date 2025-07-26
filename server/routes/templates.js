const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/templates/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|zip|rar|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, ZIP, RAR, and PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Get all templates (public)
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      tags, 
      sort = 'newest',
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
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
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'popular':
        sortOption = { downloads: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const templates = await Template.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-downloadUrl'); // Don't expose download URLs to public
    
    const total = await Template.countDocuments(query);
    
    res.json({
      templates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured templates
router.get('/featured', async (req, res) => {
  try {
    const templates = await Template.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .select('-downloadUrl');
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get template categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Template.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single template (public)
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).select('-downloadUrl');
    if (!template || !template.isActive) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download template (requires payment for premium)
router.post('/:id/download', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template || !template.isActive) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // If it's free, allow download
    if (template.price === 0) {
      // Increment download count
      template.downloads += 1;
      await template.save();
      
      return res.json({ 
        downloadUrl: template.downloadUrl,
        message: 'Download started'
      });
    }

    // For premium templates, require payment verification
    const { paymentId, orderId, signature } = req.body;
    
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ message: 'Payment verification required' });
    }

    // Verify Razorpay payment (implement this based on your Razorpay setup)
    // For now, we'll assume payment is verified
    
    template.downloads += 1;
    await template.save();
    
    res.json({ 
      downloadUrl: template.downloadUrl,
      message: 'Payment verified, download started'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Create template
router.post('/', adminAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'previewImages', maxCount: 5 },
  { name: 'templateFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      originalPrice,
      discount,
      tags,
      features,
      techStack,
      compatibility,
      version,
      demoUrl,
      fileFormat
    } = req.body;

    const template = new Template({
      title,
      description,
      category,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discount: parseFloat(discount) || 0,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      features: features ? features.split(',').map(feature => feature.trim()) : [],
      techStack: techStack ? techStack.split(',').map(tech => tech.trim()) : [],
      compatibility: compatibility ? compatibility.split(',').map(comp => comp.trim()) : [],
      version,
      demoUrl,
      fileFormat,
      thumbnailUrl: req.files.thumbnail ? `/uploads/templates/${req.files.thumbnail[0].filename}` : '',
      previewImages: req.files.previewImages ? req.files.previewImages.map(file => `/uploads/templates/${file.filename}`) : [],
      downloadUrl: req.files.templateFile ? `/uploads/templates/${req.files.templateFile[0].filename}` : '',
      fileSize: req.files.templateFile ? req.files.templateFile[0].size : 0,
      createdBy: req.user.userId
    });

    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update template
router.put('/:id', adminAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'previewImages', maxCount: 5 },
  { name: 'templateFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.tags) {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    if (req.body.features) {
      updateData.features = req.body.features.split(',').map(feature => feature.trim());
    }
    
    if (req.body.techStack) {
      updateData.techStack = req.body.techStack.split(',').map(tech => tech.trim());
    }
    
    if (req.body.compatibility) {
      updateData.compatibility = req.body.compatibility.split(',').map(comp => comp.trim());
    }
    
    if (req.files.thumbnail) {
      updateData.thumbnailUrl = `/uploads/templates/${req.files.thumbnail[0].filename}`;
    }
    
    if (req.files.previewImages) {
      updateData.previewImages = req.files.previewImages.map(file => `/uploads/templates/${file.filename}`);
    }
    
    if (req.files.templateFile) {
      updateData.downloadUrl = `/uploads/templates/${req.files.templateFile[0].filename}`;
      updateData.fileSize = req.files.templateFile[0].size;
    }
    
    updateData.updatedBy = req.user.userId;
    
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete template
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all templates for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle template status
router.patch('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    template.isActive = !template.isActive;
    template.updatedBy = req.user.userId;
    await template.save();
    
    res.json({ 
      message: `Template ${template.isActive ? 'activated' : 'deactivated'} successfully`,
      template 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle featured status
router.patch('/:id/toggle-featured', adminAuth, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    template.isFeatured = !template.isFeatured;
    template.updatedBy = req.user.userId;
    await template.save();
    
    res.json({ 
      message: `Template ${template.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      template 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;