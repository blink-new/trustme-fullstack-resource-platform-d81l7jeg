const mongoose = require('mongoose');

const extensionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Extension title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Extension description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [132, 'Short description cannot exceed 132 characters'] // Chrome Web Store limit
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Productivity', 'Developer Tools', 'Social & Communication', 'Shopping', 'News & Weather', 'Fun', 'Accessibility', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  icon: {
    type: String,
    required: [true, 'Extension icon is required']
  },
  screenshots: [{
    type: String
  }],
  downloadUrl: {
    type: String,
    required: [true, 'Download URL is required']
  },
  chromeWebStoreUrl: {
    type: String,
    match: [/^https:\/\/chrome\.google\.com\/webstore\/detail\/.*/, 'Please enter a valid Chrome Web Store URL']
  },
  githubUrl: {
    type: String,
    match: [/^https:\/\/github\.com\/.*/, 'Please enter a valid GitHub URL']
  },
  demoUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid demo URL']
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  version: {
    type: String,
    required: [true, 'Version is required'],
    default: '1.0.0',
    match: [/^\d+\.\d+\.\d+$/, 'Version must be in format x.y.z']
  },
  compatibility: [{
    type: String,
    enum: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'],
    default: ['Chrome']
  }],
  minChromeVersion: {
    type: String,
    default: '88'
  },
  permissions: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  changelog: [{
    version: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    changes: [{
      type: String,
      required: true
    }]
  }],
  downloads: {
    type: Number,
    default: 0,
    min: [0, 'Downloads cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviews: [{
    user: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  installationInstructions: {
    type: String,
    default: '1. Download the extension file\n2. Open Chrome and go to chrome://extensions/\n3. Enable Developer mode\n4. Click "Load unpacked" and select the extension folder'
  },
  supportEmail: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    default: 'support@trustme.com'
  },
  privacyPolicy: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid privacy policy URL']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  developmentStatus: {
    type: String,
    enum: ['Active', 'Maintenance', 'Deprecated'],
    default: 'Active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
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

// Virtual for discounted price
extensionSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0 && this.originalPrice) {
    return this.originalPrice - (this.originalPrice * this.discount / 100);
  }
  return this.price;
});

// Virtual for average rating
extensionSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Virtual for file size in human readable format
extensionSchema.virtual('fileSizeFormatted').get(function() {
  if (!this.fileSize) return 'Unknown';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Pre-save middleware to set isNew flag and lastUpdated
extensionSchema.pre('save', function(next) {
  // Set isNew flag based on creation date
  if (this.isNew && this.createdAt) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    this.isNew = this.createdAt > oneWeekAgo;
  }
  
  // Update lastUpdated when extension is modified
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  
  next();
});

// Method to increment downloads
extensionSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

// Method to add changelog entry
extensionSchema.methods.addChangelogEntry = function(version, changes) {
  this.changelog.unshift({
    version,
    date: new Date(),
    changes: Array.isArray(changes) ? changes : [changes]
  });
  
  // Keep only last 10 changelog entries
  if (this.changelog.length > 10) {
    this.changelog = this.changelog.slice(0, 10);
  }
  
  return this.save();
};

// Indexes for performance
extensionSchema.index({ category: 1 });
extensionSchema.index({ tags: 1 });
extensionSchema.index({ price: 1 });
extensionSchema.index({ downloads: -1 });
extensionSchema.index({ rating: -1 });
extensionSchema.index({ createdAt: -1 });
extensionSchema.index({ lastUpdated: -1 });
extensionSchema.index({ isActive: 1, isFeatured: -1, isNew: -1 });
extensionSchema.index({ compatibility: 1 });

// Text search index
extensionSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Extension', extensionSchema);