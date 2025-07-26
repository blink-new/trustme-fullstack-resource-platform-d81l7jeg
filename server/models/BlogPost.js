const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Web Development', 'Mobile Development', 'UI/UX Design', 'DevOps', 'AI/ML', 'Cybersecurity', 'Blockchain', 'Tutorial', 'News', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  images: [{
    type: String
  }],
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      default: 'Sachin'
    },
    bio: {
      type: String,
      default: 'Full-stack developer and creator of Trustme platform'
    },
    avatar: {
      type: String,
      default: '/images/author-avatar.jpg'
    },
    social: {
      twitter: String,
      linkedin: String,
      github: String,
      website: String
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  comments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  downloadableFiles: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['PDF', 'ZIP', 'DOC', 'PPT', 'XLS', 'TXT', 'Other'],
      default: 'PDF'
    },
    fileSize: {
      type: Number, // in bytes
      min: [0, 'File size cannot be negative']
    },
    downloads: {
      type: Number,
      default: 0,
      min: [0, 'Downloads cannot be negative']
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    }
  }],
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    canonicalUrl: String,
    ogImage: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug and set published date
blogPostSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set published date when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate reading time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  // Auto-generate SEO fields if not provided
  if (!this.seo.metaTitle && this.title) {
    this.seo.metaTitle = this.title.substring(0, 60);
  }
  
  if (!this.seo.metaDescription && this.excerpt) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }
  
  next();
});

// Method to increment views
blogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
blogPostSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Virtual for approved comments count
blogPostSchema.virtual('approvedCommentsCount').get(function() {
  return this.comments.filter(comment => comment.isApproved).length;
});

// Virtual for total downloads of all files
blogPostSchema.virtual('totalDownloads').get(function() {
  return this.downloadableFiles.reduce((total, file) => total + file.downloads, 0);
});

// Indexes for performance
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ views: -1 });
blogPostSchema.index({ likes: -1 });
blogPostSchema.index({ createdAt: -1 });
blogPostSchema.index({ isActive: 1, isFeatured: -1, isPinned: -1 });

// Text search index
blogPostSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

module.exports = mongoose.model('BlogPost', blogPostSchema);