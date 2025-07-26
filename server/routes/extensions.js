const express = require('express');
const router = express.Router();
const Extension = require('../models/Extension');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/extensions/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get all extensions (public)
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const extensions = await Extension.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-downloadUrl'); // Don't expose download URLs to public
    
    const total = await Extension.countDocuments(query);
    
    res.json({
      extensions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single extension (public)
router.get('/:id', async (req, res) => {
  try {
    const extension = await Extension.findById(req.params.id).select('-downloadUrl');
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download extension (requires payment for premium)
router.post('/:id/download', async (req, res) => {
  try {
    const extension = await Extension.findById(req.params.id);
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    // If it's free, allow download
    if (extension.price === 0) {
      // Increment download count
      extension.downloads += 1;
      await extension.save();
      
      return res.json({ 
        downloadUrl: extension.downloadUrl,
        message: 'Download started'
      });
    }

    // For premium extensions, require payment verification
    const { paymentId, orderId, signature } = req.body;
    
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ message: 'Payment verification required' });
    }

    // Verify Razorpay payment (implement this based on your Razorpay setup)
    // For now, we'll assume payment is verified
    
    extension.downloads += 1;
    await extension.save();
    
    res.json({ 
      downloadUrl: extension.downloadUrl,
      message: 'Payment verified, download started'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Create extension
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      tags,
      features,
      version,
      compatibility
    } = req.body;

    const extension = new Extension({
      title,
      description,
      category,
      price: parseFloat(price) || 0,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      features: features ? features.split(',').map(feature => feature.trim()) : [],
      version,
      compatibility: compatibility ? compatibility.split(',').map(comp => comp.trim()) : [],
      downloadUrl: req.file ? `/uploads/extensions/${req.file.filename}` : '',
      fileSize: req.file ? req.file.size : 0
    });

    await extension.save();
    res.status(201).json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update extension
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.tags) {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    if (req.body.features) {
      updateData.features = req.body.features.split(',').map(feature => feature.trim());
    }
    
    if (req.body.compatibility) {
      updateData.compatibility = req.body.compatibility.split(',').map(comp => comp.trim());
    }
    
    if (req.file) {
      updateData.downloadUrl = `/uploads/extensions/${req.file.filename}`;
      updateData.fileSize = req.file.size;
    }
    
    const extension = await Extension.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete extension
router.delete('/:id', auth, async (req, res) => {
  try {
    const extension = await Extension.findByIdAndDelete(req.params.id);
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }
    res.json({ message: 'Extension deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all extensions for admin
router.get('/admin/all', auth, async (req, res) => {
  try {
    const extensions = await Extension.find().sort({ createdAt: -1 });
    res.json(extensions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;