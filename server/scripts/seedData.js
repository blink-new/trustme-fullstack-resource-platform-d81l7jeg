const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Template = require('../models/Template');
const Tool = require('../models/Tool');
const BlogPost = require('../models/BlogPost');
const Extension = require('../models/Extension');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://avinashbodare02:your_password@newidea.73p4abg.mongodb.net/trustme');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin;
    }

    const adminUser = new User({
      username: 'admin',
      email: 'admin@trustme.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Seed sample templates
const seedTemplates = async (adminId) => {
  try {
    const existingTemplates = await Template.countDocuments();
    if (existingTemplates > 0) {
      console.log('Templates already exist');
      return;
    }

    const templates = [
      {
        title: 'Modern Admin Dashboard',
        description: 'A sleek and modern admin dashboard template with dark mode support, responsive design, and comprehensive components.',
        category: 'Admin Dashboard',
        tags: ['admin', 'dashboard', 'react', 'tailwind', 'dark-mode'],
        price: 0,
        thumbnailUrl: '/images/templates/admin-dashboard-thumb.jpg',
        previewImages: ['/images/templates/admin-dashboard-1.jpg', '/images/templates/admin-dashboard-2.jpg'],
        demoUrl: 'https://demo.trustme.com/admin-dashboard',
        downloadUrl: '/downloads/templates/admin-dashboard.zip',
        fileSize: 15728640, // 15MB
        fileFormat: 'React',
        features: ['Responsive Design', 'Dark Mode', 'Charts & Analytics', 'User Management', 'Settings Panel'],
        techStack: ['React', 'Tailwind CSS', 'Chart.js', 'React Router'],
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        version: '1.0.0',
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      },
      {
        title: 'E-commerce Landing Page',
        description: 'Beautiful e-commerce landing page template with product showcase, shopping cart, and payment integration.',
        category: 'E-commerce',
        tags: ['ecommerce', 'landing', 'shopping', 'responsive'],
        price: 499,
        originalPrice: 999,
        discount: 50,
        thumbnailUrl: '/images/templates/ecommerce-thumb.jpg',
        previewImages: ['/images/templates/ecommerce-1.jpg', '/images/templates/ecommerce-2.jpg'],
        demoUrl: 'https://demo.trustme.com/ecommerce',
        downloadUrl: '/downloads/templates/ecommerce-landing.zip',
        fileSize: 25165824, // 24MB
        fileFormat: 'HTML/CSS/JS',
        features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'User Reviews', 'Mobile Responsive'],
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
        compatibility: ['All Modern Browsers'],
        version: '2.1.0',
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      },
      {
        title: 'Portfolio Website Template',
        description: 'Clean and professional portfolio template perfect for designers, developers, and creative professionals.',
        category: 'Portfolio',
        tags: ['portfolio', 'creative', 'professional', 'minimal'],
        price: 0,
        thumbnailUrl: '/images/templates/portfolio-thumb.jpg',
        previewImages: ['/images/templates/portfolio-1.jpg', '/images/templates/portfolio-2.jpg'],
        demoUrl: 'https://demo.trustme.com/portfolio',
        downloadUrl: '/downloads/templates/portfolio.zip',
        fileSize: 8388608, // 8MB
        fileFormat: 'HTML/CSS/JS',
        features: ['Project Gallery', 'Contact Form', 'About Section', 'Skills Showcase', 'Testimonials'],
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'SCSS'],
        compatibility: ['All Modern Browsers'],
        version: '1.5.0',
        isActive: true,
        isFeatured: false,
        createdBy: adminId
      }
    ];

    await Template.insertMany(templates);
    console.log('Sample templates created successfully');
  } catch (error) {
    console.error('Error seeding templates:', error);
  }
};

// Seed sample tools
const seedTools = async (adminId) => {
  try {
    const existingTools = await Tool.countDocuments();
    if (existingTools > 0) {
      console.log('Tools already exist');
      return;
    }

    const tools = [
      {
        name: 'BMI Calculator',
        description: 'Calculate your Body Mass Index (BMI) with this easy-to-use calculator. Get instant results with health recommendations.',
        category: 'Productivity',
        type: 'embedded',
        embedCode: '<div id="bmi-calculator">BMI Calculator Tool</div>',
        thumbnailUrl: '/images/tools/bmi-calculator.jpg',
        tags: ['health', 'calculator', 'fitness', 'bmi'],
        features: ['Instant Calculation', 'Health Recommendations', 'BMI Categories', 'Mobile Friendly'],
        price: 0,
        isPremium: false,
        difficulty: 'Beginner',
        estimatedTime: '2 minutes',
        instructions: 'Enter your height and weight to calculate your BMI instantly.',
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      },
      {
        name: 'Color Palette Generator',
        description: 'Generate beautiful color palettes for your design projects. Export in various formats including HEX, RGB, and HSL.',
        category: 'Design',
        type: 'embedded',
        embedCode: '<div id="color-palette-generator">Color Palette Generator</div>',
        thumbnailUrl: '/images/tools/color-palette.jpg',
        tags: ['design', 'colors', 'palette', 'generator'],
        features: ['Random Generation', 'Color Harmony', 'Export Options', 'Accessibility Check'],
        price: 0,
        isPremium: false,
        difficulty: 'Beginner',
        estimatedTime: '5 minutes',
        instructions: 'Click generate to create random color palettes or customize your own.',
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      },
      {
        name: 'Resume Generator Pro',
        description: 'Create professional ATS-optimized resumes with our advanced resume builder. Multiple templates and export options.',
        category: 'Productivity',
        type: 'embedded',
        embedCode: '<div id="resume-generator">Resume Generator Pro</div>',
        thumbnailUrl: '/images/tools/resume-generator.jpg',
        tags: ['resume', 'cv', 'job', 'professional', 'ats'],
        features: ['ATS Optimization', 'Multiple Templates', 'PDF Export', 'Real-time Preview'],
        price: 299,
        isPremium: true,
        difficulty: 'Intermediate',
        estimatedTime: '30 minutes',
        instructions: 'Fill in your details step by step to create a professional resume.',
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      }
    ];

    await Tool.insertMany(tools);
    console.log('Sample tools created successfully');
  } catch (error) {
    console.error('Error seeding tools:', error);
  }
};

// Seed sample blog posts
const seedBlogPosts = async (adminId) => {
  try {
    const existingPosts = await BlogPost.countDocuments();
    if (existingPosts > 0) {
      console.log('Blog posts already exist');
      return;
    }

    const blogPosts = [
      {
        title: 'Getting Started with React and TypeScript',
        slug: 'getting-started-react-typescript',
        excerpt: 'Learn how to set up a React project with TypeScript and best practices for type-safe development.',
        content: `
# Getting Started with React and TypeScript

React and TypeScript make a powerful combination for building robust web applications. In this comprehensive guide, we'll walk through setting up a new React project with TypeScript and explore best practices.

## Why TypeScript with React?

TypeScript brings several benefits to React development:
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Improved Code Quality**: Self-documenting code with types
- **Easier Refactoring**: Confident code changes

## Setting Up the Project

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Best Practices

1. **Use Interface for Props**
2. **Leverage Union Types**
3. **Implement Proper Error Handling**
4. **Use Generic Components**

This is just the beginning of your TypeScript journey with React!
        `,
        category: 'Web Development',
        tags: ['react', 'typescript', 'javascript', 'frontend'],
        featuredImage: '/images/blog/react-typescript.jpg',
        author: {
          name: 'Sachin',
          bio: 'Full-stack developer and creator of Trustme platform',
          avatar: '/images/author-avatar.jpg'
        },
        status: 'published',
        publishedAt: new Date(),
        readingTime: 8,
        downloadableFiles: [
          {
            name: 'React TypeScript Starter Kit',
            description: 'Complete starter template with TypeScript configuration',
            url: '/downloads/blog/react-typescript-starter.zip',
            fileType: 'ZIP',
            fileSize: 5242880, // 5MB
            isPremium: false,
            price: 0
          },
          {
            name: 'TypeScript Cheat Sheet',
            description: 'Comprehensive TypeScript reference guide',
            url: '/downloads/blog/typescript-cheat-sheet.pdf',
            fileType: 'PDF',
            fileSize: 1048576, // 1MB
            isPremium: true,
            price: 99
          }
        ],
        seo: {
          metaTitle: 'Getting Started with React and TypeScript - Complete Guide',
          metaDescription: 'Learn React with TypeScript from scratch. Complete guide with examples, best practices, and downloadable resources.',
          keywords: ['react', 'typescript', 'tutorial', 'web development']
        },
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      },
      {
        title: 'Building Responsive Web Applications',
        slug: 'building-responsive-web-applications',
        excerpt: 'Master the art of creating responsive web applications that work seamlessly across all devices.',
        content: `
# Building Responsive Web Applications

In today's multi-device world, creating responsive web applications is not just a nice-to-have—it's essential. This guide covers everything you need to know about responsive design.

## Mobile-First Approach

Start designing for mobile devices first, then progressively enhance for larger screens:

\`\`\`css
/* Mobile styles first */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 2rem;
  }
}
\`\`\`

## Flexible Grid Systems

Use CSS Grid and Flexbox for flexible layouts that adapt to different screen sizes.

## Testing Across Devices

Always test your applications on real devices and use browser developer tools for responsive testing.
        `,
        category: 'Web Development',
        tags: ['responsive', 'css', 'mobile', 'design'],
        featuredImage: '/images/blog/responsive-design.jpg',
        author: {
          name: 'Sachin',
          bio: 'Full-stack developer and creator of Trustme platform',
          avatar: '/images/author-avatar.jpg'
        },
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000), // Yesterday
        readingTime: 12,
        downloadableFiles: [
          {
            name: 'Responsive Design Checklist',
            description: 'Complete checklist for responsive web development',
            url: '/downloads/blog/responsive-checklist.pdf',
            fileType: 'PDF',
            fileSize: 2097152, // 2MB
            isPremium: false,
            price: 0
          }
        ],
        seo: {
          metaTitle: 'Building Responsive Web Applications - Complete Guide',
          metaDescription: 'Learn how to build responsive web applications with modern CSS techniques and best practices.',
          keywords: ['responsive design', 'css', 'mobile first', 'web development']
        },
        isActive: true,
        isFeatured: true,
        createdBy: adminId
      }
    ];

    await BlogPost.insertMany(blogPosts);
    console.log('Sample blog posts created successfully');
  } catch (error) {
    console.error('Error seeding blog posts:', error);
  }
};

// Seed sample Chrome extensions
const seedExtensions = async (adminId) => {
  try {
    const existingExtensions = await Extension.countDocuments();
    if (existingExtensions > 0) {
      console.log('Extensions already exist');
      return;
    }

    const extensions = [
      {
        title: 'Productivity Booster',
        description: 'Enhance your productivity with this all-in-one Chrome extension featuring task management, time tracking, and focus tools.',
        shortDescription: 'All-in-one productivity extension with task management and time tracking features.',
        category: 'Productivity',
        tags: ['productivity', 'tasks', 'time-tracking', 'focus'],
        price: 0,
        icon: '/images/extensions/productivity-booster-icon.png',
        screenshots: [
          '/images/extensions/productivity-booster-1.jpg',
          '/images/extensions/productivity-booster-2.jpg',
          '/images/extensions/productivity-booster-3.jpg'
        ],
        downloadUrl: '/downloads/extensions/productivity-booster.zip',
        fileSize: 2097152, // 2MB
        version: '1.2.0',
        compatibility: ['Chrome'],
        minChromeVersion: '88',
        permissions: ['storage', 'activeTab', 'notifications'],
        features: [
          'Task Management',
          'Pomodoro Timer',
          'Website Blocker',
          'Daily Goals Tracking',
          'Productivity Analytics'
        ],
        changelog: [
          {
            version: '1.2.0',
            date: new Date(),
            changes: [
              'Added dark mode support',
              'Improved task synchronization',
              'Fixed notification bugs'
            ]
          },
          {
            version: '1.1.0',
            date: new Date(Date.now() - 2592000000), // 30 days ago
            changes: [
              'Added Pomodoro timer',
              'Enhanced UI design',
              'Added export functionality'
            ]
          }
        ],
        installationInstructions: '1. Download the extension ZIP file\n2. Extract to a folder\n3. Open Chrome and go to chrome://extensions/\n4. Enable Developer mode\n5. Click "Load unpacked" and select the extension folder',
        isActive: true,
        isFeatured: true,
        isNew: true,
        createdBy: adminId
      },
      {
        title: 'Code Snippet Manager',
        description: 'Save, organize, and quickly access your favorite code snippets directly from your browser. Perfect for developers.',
        shortDescription: 'Save and organize code snippets with syntax highlighting and quick access.',
        category: 'Developer Tools',
        tags: ['code', 'snippets', 'developer', 'programming'],
        price: 199,
        originalPrice: 399,
        discount: 50,
        icon: '/images/extensions/code-snippet-icon.png',
        screenshots: [
          '/images/extensions/code-snippet-1.jpg',
          '/images/extensions/code-snippet-2.jpg'
        ],
        downloadUrl: '/downloads/extensions/code-snippet-manager.zip',
        githubUrl: 'https://github.com/trustme/code-snippet-manager',
        fileSize: 1572864, // 1.5MB
        version: '2.0.1',
        compatibility: ['Chrome', 'Edge'],
        minChromeVersion: '90',
        permissions: ['storage', 'contextMenus'],
        features: [
          'Syntax Highlighting',
          'Multiple Languages Support',
          'Search & Filter',
          'Import/Export',
          'Cloud Sync'
        ],
        changelog: [
          {
            version: '2.0.1',
            date: new Date(),
            changes: [
              'Fixed search functionality',
              'Added TypeScript support',
              'Improved performance'
            ]
          }
        ],
        isActive: true,
        isFeatured: true,
        isNew: false,
        createdBy: adminId
      },
      {
        title: 'Social Media Scheduler',
        description: 'Schedule and manage your social media posts across multiple platforms directly from your browser.',
        shortDescription: 'Schedule social media posts across multiple platforms with analytics.',
        category: 'Social & Communication',
        tags: ['social-media', 'scheduler', 'marketing', 'automation'],
        price: 0,
        icon: '/images/extensions/social-scheduler-icon.png',
        screenshots: [
          '/images/extensions/social-scheduler-1.jpg',
          '/images/extensions/social-scheduler-2.jpg',
          '/images/extensions/social-scheduler-3.jpg'
        ],
        downloadUrl: '/downloads/extensions/social-media-scheduler.zip',
        fileSize: 3145728, // 3MB
        version: '1.0.0',
        compatibility: ['Chrome', 'Firefox'],
        minChromeVersion: '85',
        permissions: ['storage', 'activeTab', 'https://*.twitter.com/*', 'https://*.facebook.com/*'],
        features: [
          'Multi-Platform Support',
          'Post Scheduling',
          'Analytics Dashboard',
          'Content Calendar',
          'Bulk Upload'
        ],
        changelog: [
          {
            version: '1.0.0',
            date: new Date(),
            changes: [
              'Initial release',
              'Support for Twitter and Facebook',
              'Basic scheduling functionality'
            ]
          }
        ],
        isActive: true,
        isFeatured: false,
        isNew: true,
        createdBy: adminId
      },
      {
        title: 'Password Security Checker',
        description: 'Check the strength of your passwords and get recommendations for creating secure passwords.',
        shortDescription: 'Advanced password strength checker with security recommendations.',
        category: 'Accessibility',
        tags: ['security', 'password', 'privacy', 'safety'],
        price: 99,
        icon: '/images/extensions/password-checker-icon.png',
        screenshots: [
          '/images/extensions/password-checker-1.jpg',
          '/images/extensions/password-checker-2.jpg'
        ],
        downloadUrl: '/downloads/extensions/password-security-checker.zip',
        fileSize: 1048576, // 1MB
        version: '1.1.2',
        compatibility: ['Chrome'],
        minChromeVersion: '92',
        permissions: ['activeTab'],
        features: [
          'Real-time Strength Analysis',
          'Security Recommendations',
          'Breach Database Check',
          'Password Generator',
          'Privacy Focused'
        ],
        changelog: [
          {
            version: '1.1.2',
            date: new Date(),
            changes: [
              'Enhanced security algorithms',
              'Added breach database integration',
              'Improved UI/UX'
            ]
          }
        ],
        privacyPolicy: 'https://trustme.com/privacy-policy',
        isActive: true,
        isFeatured: true,
        isNew: false,
        createdBy: adminId
      }
    ];

    await Extension.insertMany(extensions);
    console.log('Sample Chrome extensions created successfully');
  } catch (error) {
    console.error('Error seeding extensions:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Create admin user first
    const adminUser = await createAdminUser();
    
    if (adminUser) {
      // Seed all data with admin user ID
      await Promise.all([
        seedTemplates(adminUser._id),
        seedTools(adminUser._id),
        seedBlogPosts(adminUser._id),
        seedExtensions(adminUser._id)
      ]);
    }
    
    console.log('Database seeding completed successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };