const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Template title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Template description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Admin Dashboard', 'Landing Page', 'E-commerce', 'Portfolio', 'Blog', 'Corporate', 'Creative', 'Other'],
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
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  previewImages: [{
    type: String
  }],
  demoUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  downloadUrl: {
    type: String,
    required: [true, 'Download URL is required']
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  fileFormat: {
    type: String,
    enum: ['HTML/CSS/JS', 'React', 'Vue', 'Angular', 'WordPress', 'Figma', 'Sketch', 'PSD'],
    default: 'HTML/CSS/JS'
  },
  features: [{
    type: String,
    trim: true
  }],
  techStack: [{
    type: String,
    trim: true
  }],
  compatibility: [{
    type: String,
    trim: true
  }],
  version: {
    type: String,
    default: '1.0.0'
  },
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
templateSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0 && this.originalPrice) {
    return this.originalPrice - (this.originalPrice * this.discount / 100);
  }
  return this.price;
});

// Virtual for average rating
templateSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Pre-save middleware to set isNew flag
templateSchema.pre('save', function(next) {
  if (this.isNew && this.createdAt) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    this.isNew = this.createdAt > oneWeekAgo;
  }
  next();
});

// Indexes for performance
templateSchema.index({ category: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ price: 1 });
templateSchema.index({ downloads: -1 });
templateSchema.index({ rating: -1 });
templateSchema.index({ createdAt: -1 });
templateSchema.index({ isActive: 1, isFeatured: -1 });

// Text search index
templateSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Template', templateSchema);