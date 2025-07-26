# Trustme - Full-Stack Resource Platform

A comprehensive full-stack web platform developed by Sachin, offering downloadable website templates, productivity tools, tech blog with downloadable notes, and a curated collection of Chrome extensions.

## 🚀 Features

### Frontend (User Side)
- **Home Page**: Platform introduction with featured content
- **Website Templates**: Download UI kits, admin panels, and more with preview functionality
- **Tools**: Interactive productivity tools (Resume Generator, BMI Calculator, Color Palette Generator, etc.)
- **Blog**: Tech articles with downloadable PDFs and notes
- **Chrome Extensions**: Curated collection with detailed previews and downloads
- **Payment Integration**: Secure payments via Razorpay for premium content
- **Content Protection**: Advanced security to prevent unauthorized downloads/screenshots

### Backend (Admin CMS)
- **Admin Dashboard**: Complete content management system
- **User Management**: Admin authentication and user control
- **Content Management**: Add/edit/delete templates, tools, blog posts, and extensions
- **File Upload**: Direct file upload and management
- **Analytics**: Track downloads, views, and user engagement
- **Security**: Advanced security measures and rate limiting

## 🛠 Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN UI** for components
- **React Router** for navigation

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Razorpay** for payment processing
- **PDFKit** for resume generation

### Security Features
- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input sanitization** and XSS protection
- **CORS** configuration
- **Content protection** against unauthorized access
- **Developer tools blocking**

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Razorpay account (for payments)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Start server
npm run dev
```

### Database Seeding
```bash
# Seed the database with sample data
cd server
node scripts/seedData.js
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustme

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=5000

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_SECURITY=true
```

## 🚀 Deployment

### Hostinger Deployment

1. **Prepare for Production**
   ```bash
   # Build frontend
   npm run build
   
   # Build backend
   cd server
   npm install --production
   ```

2. **Upload Files**
   - Upload the `dist` folder contents to your domain's public_html
   - Upload the `server` folder to a subdirectory (e.g., `api`)

3. **Configure Environment**
   - Set up environment variables in your hosting panel
   - Configure MongoDB connection string
   - Set up Razorpay credentials

4. **Set up Node.js**
   - Enable Node.js in your hosting panel
   - Set the startup file to `server/server.js`
   - Configure the Node.js version (16+)

### Alternative Deployment Options

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway/Heroku (Backend)
```bash
# Add to package.json
"scripts": {
  "start": "node server.js"
}

# Deploy to Railway
railway login
railway link
railway up
```

## 👤 Admin Access

After seeding the database, use these credentials to access the admin panel:

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/featured` - Get featured templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates/:id/download` - Download template
- `POST /api/templates` - Create template (Admin)
- `PUT /api/templates/:id` - Update template (Admin)
- `DELETE /api/templates/:id` - Delete template (Admin)

### Tools
- `GET /api/tools` - Get all tools
- `GET /api/tools/:id` - Get single tool
- `POST /api/tools/:id/use` - Use tool
- `POST /api/tools` - Create tool (Admin)

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog/:slug/like` - Like blog post
- `POST /api/blog/:slug/comments` - Add comment
- `POST /api/blog/:slug/download/:fileIndex` - Download file

### Extensions
- `GET /api/extensions` - Get all extensions
- `GET /api/extensions/:id` - Get single extension
- `POST /api/extensions/:id/download` - Download extension

### Resume
- `GET /api/resume/templates` - Get resume templates
- `POST /api/resume/generate` - Generate resume PDF

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment

## 🔒 Security Features

### Content Protection
- **Right-click disabled** on premium content
- **Developer tools blocking** with detection
- **Screenshot prevention** with blur overlay
- **Copy/paste disabled** for protected content
- **Watermark overlay** on premium previews

### Backend Security
- **Rate limiting** (100 requests per 15 minutes)
- **Auth rate limiting** (5 login attempts per 15 minutes)
- **Input sanitization** against NoSQL injection
- **XSS protection** with xss-clean
- **HTTP Parameter Pollution** prevention
- **Secure headers** with Helmet.js
- **CORS** configuration
- **JWT token** authentication
- **Password hashing** with bcrypt

## 📊 Features Overview

### Templates Section
- ✅ **Preview before purchase** with modal gallery
- ✅ **Search and filtering** by category, price, tags
- ✅ **Free and premium** templates
- ✅ **Download tracking** and analytics
- ✅ **Responsive design** previews

### Tools Section
- ✅ **BMI Calculator** with health recommendations
- ✅ **Color Palette Generator** with export options
- ✅ **Resume Generator** with ATS-optimized templates
- ✅ **Interactive demos** before purchase
- ✅ **Usage tracking** and analytics

### Blog Section
- ✅ **Rich content** with markdown support
- ✅ **Downloadable resources** (PDFs, code samples)
- ✅ **Comment system** with moderation
- ✅ **Like functionality** and view tracking
- ✅ **SEO optimization** with meta tags

### Extensions Section
- ✅ **Chrome extension showcase** with screenshots
- ✅ **Installation instructions** and compatibility info
- ✅ **Version history** and changelog
- ✅ **Free and premium** extensions
- ✅ **Download tracking** and user reviews

### Resume Generator
- ✅ **Multiple ATS-optimized templates**
- ✅ **Real-time preview** while editing
- ✅ **PDF export** with professional formatting
- ✅ **Free and premium** templates
- ✅ **Payment integration** for premium features

## 🎨 Customization

### Adding New Templates
1. Use the admin dashboard to upload template files
2. Add preview images and descriptions
3. Set pricing and category
4. Configure download permissions

### Creating New Tools
1. Develop the tool interface
2. Add to the tools database via admin panel
3. Configure pricing and access controls
4. Test functionality and user experience

### Writing Blog Posts
1. Use the admin dashboard editor
2. Add downloadable resources
3. Configure SEO settings
4. Set publication status and featured flag

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Sachin** - Full-stack Developer
- Platform Creator and Maintainer
- Specialized in MERN stack development
- Contact: [Your Contact Information]

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the developer directly
- Check the documentation and FAQ

## 🔄 Updates

The platform is actively maintained with regular updates:
- **Security patches** and improvements
- **New features** and tools
- **Content updates** and additions
- **Performance optimizations**

---

**Built with ❤️ by Sachin using the MERN stack**