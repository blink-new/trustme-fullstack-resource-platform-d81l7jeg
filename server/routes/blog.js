const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf' || 
                     file.mimetype === 'application/msword' || 
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     file.mimetype === 'application/zip' ||
                     file.mimetype === 'application/x-rar-compressed';

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, documents, and archives are allowed'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get all published blog posts (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      search, 
      category, 
      tags,
      sort = 'newest',
      page = 1, 
      limit = 10 
    } = req.query;
    
    let query = { status: 'published', isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
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
        sortOption = { publishedAt: -1 };
        break;
      case 'oldest':
        sortOption = { publishedAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'liked':
        sortOption = { likes: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { publishedAt: -1 };
    }
    
    const posts = await BlogPost.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Don't send full content in list view
    
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured blog posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await BlogPost.find({ 
      status: 'published',
      isActive: true, 
      isFeatured: true 
    })
    .sort({ publishedAt: -1 })
    .limit(6)
    .select('-content');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { 
      status: 'published', 
      isActive: true 
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get popular tags
router.get('/tags', async (req, res) => {
  try {
    const posts = await BlogPost.find({ 
      status: 'published', 
      isActive: true 
    }).select('tags');
    
    const tagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const sortedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));
    
    res.json(sortedTags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single blog post by slug (public)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isActive: true
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment view count
    await post.incrementViews();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like a blog post
router.post('/:slug/like', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isActive: true
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    await post.incrementLikes();
    
    res.json({ 
      message: 'Post liked successfully',
      likes: post.likes + 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment to blog post
router.post('/:slug/comments', async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    
    if (!name || !email || !comment) {
      return res.status(400).json({ message: 'Name, email, and comment are required' });
    }
    
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isActive: true
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    post.comments.push({
      name,
      email,
      comment,
      isApproved: false // Comments need admin approval
    });
    
    await post.save();
    
    res.json({ 
      message: 'Comment submitted successfully. It will be visible after approval.',
      comment: {
        name,
        comment,
        date: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download file from blog post
router.post('/:slug/download/:fileIndex', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isActive: true
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const fileIndex = parseInt(req.params.fileIndex);
    const file = post.downloadableFiles[fileIndex];
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if file is premium and requires payment
    if (file.isPremium && file.price > 0) {
      const { paymentId, orderId, signature } = req.body;
      
      if (!paymentId || !orderId || !signature) {
        return res.status(400).json({ 
          message: 'Payment verification required for premium file',
          file: {
            name: file.name,
            price: file.price,
            isPremium: file.isPremium
          }
        });
      }
      
      // Verify Razorpay payment (implement this based on your Razorpay setup)
      // For now, we'll assume payment is verified
    }
    
    // Increment download count
    file.downloads += 1;
    await post.save();
    
    res.json({ 
      downloadUrl: file.url,
      message: 'Download started',
      fileName: file.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Create blog post
router.post('/', adminAuth, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'downloadableFiles', maxCount: 5 }
]), async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      status,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      isFeatured,
      isPinned
    } = req.body;

    const post = new BlogPost({
      title,
      excerpt,
      content,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'draft',
      featuredImage: req.files.featuredImage ? `/uploads/blog/${req.files.featuredImage[0].filename}` : '',
      images: req.files.images ? req.files.images.map(file => `/uploads/blog/${file.filename}`) : [],
      seo: {
        metaTitle,
        metaDescription,
        keywords: keywords ? keywords.split(',').map(keyword => keyword.trim()) : [],
        canonicalUrl
      },
      isFeatured: isFeatured === 'true',
      isPinned: isPinned === 'true',
      createdBy: req.user.userId
    });

    // Handle downloadable files
    if (req.files.downloadableFiles) {
      const fileData = JSON.parse(req.body.fileData || '[]');
      post.downloadableFiles = req.files.downloadableFiles.map((file, index) => ({
        name: fileData[index]?.name || file.originalname,
        description: fileData[index]?.description || '',
        url: `/uploads/blog/${file.filename}`,
        fileType: path.extname(file.originalname).substring(1).toUpperCase(),
        fileSize: file.size,
        isPremium: fileData[index]?.isPremium === 'true',
        price: parseFloat(fileData[index]?.price) || 0
      }));
    }

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update blog post
router.put('/:id', adminAuth, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'downloadableFiles', maxCount: 5 }
]), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.tags) {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    if (req.body.keywords) {
      updateData['seo.keywords'] = req.body.keywords.split(',').map(keyword => keyword.trim());
    }
    
    if (req.body.isFeatured) {
      updateData.isFeatured = req.body.isFeatured === 'true';
    }
    
    if (req.body.isPinned) {
      updateData.isPinned = req.body.isPinned === 'true';
    }
    
    if (req.files.featuredImage) {
      updateData.featuredImage = `/uploads/blog/${req.files.featuredImage[0].filename}`;
    }
    
    if (req.files.images) {
      updateData.images = req.files.images.map(file => `/uploads/blog/${file.filename}`);
    }
    
    // Handle downloadable files update
    if (req.files.downloadableFiles) {
      const fileData = JSON.parse(req.body.fileData || '[]');
      updateData.downloadableFiles = req.files.downloadableFiles.map((file, index) => ({
        name: fileData[index]?.name || file.originalname,
        description: fileData[index]?.description || '',
        url: `/uploads/blog/${file.filename}`,
        fileType: path.extname(file.originalname).substring(1).toUpperCase(),
        fileSize: file.size,
        isPremium: fileData[index]?.isPremium === 'true',
        price: parseFloat(fileData[index]?.price) || 0,
        downloads: 0
      }));
    }
    
    updateData.updatedBy = req.user.userId;
    
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete blog post
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all blog posts for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle blog post status
router.patch('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    post.isActive = !post.isActive;
    post.updatedBy = req.user.userId;
    await post.save();
    
    res.json({ 
      message: `Blog post ${post.isActive ? 'activated' : 'deactivated'} successfully`,
      post 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/reject comment
router.patch('/:id/comments/:commentId/approve', adminAuth, async (req, res) => {
  try {
    const { approve } = req.body;
    
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.isApproved = approve === true;
    await post.save();
    
    res.json({ 
      message: `Comment ${approve ? 'approved' : 'rejected'} successfully`,
      comment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;