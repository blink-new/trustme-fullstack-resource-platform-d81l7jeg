const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tool name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Tool description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Productivity', 'Design', 'Development', 'Marketing', 'Analytics', 'Utility', 'Other'],
    default: 'Other'
  },
  type: {
    type: String,
    required: [true, 'Tool type is required'],
    enum: ['embedded', 'external', 'downloadable'],
    default: 'embedded'
  },
  url: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.type === 'external' || this.type === 'downloadable') {
          return /^https?:\/\/.+/.test(v);
        }
        return true;
      },
      message: 'Please enter a valid URL for external/downloadable tools'
    }
  },
  embedCode: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.type === 'embedded') {
          return v && v.length > 0;
        }
        return true;
      },
      message: 'Embed code is required for embedded tools'
    }
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  screenshots: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
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
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedTime: {
    type: String, // e.g., "5 minutes", "1 hour"
    default: '5 minutes'
  },
  instructions: {
    type: String,
    maxlength: [1000, 'Instructions cannot exceed 1000 characters']
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

// Virtual for average rating
toolSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Method to increment usage count
toolSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Indexes for performance
toolSchema.index({ category: 1 });
toolSchema.index({ type: 1 });
toolSchema.index({ tags: 1 });
toolSchema.index({ price: 1 });
toolSchema.index({ usageCount: -1 });
toolSchema.index({ rating: -1 });
toolSchema.index({ createdAt: -1 });
toolSchema.index({ isActive: 1, isFeatured: -1 });

// Text search index
toolSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Tool', toolSchema);