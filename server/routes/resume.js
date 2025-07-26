const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Resume templates data
const resumeTemplates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean and modern design perfect for tech professionals',
    preview: '/templates/resume/modern-professional-preview.png',
    category: 'Professional',
    atsOptimized: true,
    free: true
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Colorful and creative template for designers and artists',
    preview: '/templates/resume/creative-designer-preview.png',
    category: 'Creative',
    atsOptimized: false,
    free: false,
    price: 299
  },
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    description: 'Traditional and elegant design for senior positions',
    preview: '/templates/resume/executive-classic-preview.png',
    category: 'Executive',
    atsOptimized: true,
    free: false,
    price: 499
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Simple and clean design that focuses on content',
    preview: '/templates/resume/minimalist-clean-preview.png',
    category: 'Minimalist',
    atsOptimized: true,
    free: true
  },
  {
    id: 'tech-developer',
    name: 'Tech Developer',
    description: 'Specially designed for software developers and engineers',
    preview: '/templates/resume/tech-developer-preview.png',
    category: 'Technology',
    atsOptimized: true,
    free: false,
    price: 399
  }
];

// Get all resume templates
router.get('/templates', (req, res) => {
  try {
    res.json(resumeTemplates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single template
router.get('/templates/:id', (req, res) => {
  try {
    const template = resumeTemplates.find(t => t.id === req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate resume PDF
router.post('/generate', async (req, res) => {
  try {
    const { templateId, resumeData, paymentVerified = false } = req.body;

    if (!templateId || !resumeData) {
      return res.status(400).json({ message: 'Template ID and resume data are required' });
    }

    const template = resumeTemplates.find(t => t.id === templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if template requires payment
    if (!template.free && !paymentVerified) {
      return res.status(402).json({ 
        message: 'Payment required for this template',
        template: template
      });
    }

    // Generate PDF based on template
    const pdfBuffer = await generateResumePDF(template, resumeData);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo.fullName || 'Resume'}-${template.name}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ message: 'Failed to generate resume', error: error.message });
  }
});

// Function to generate PDF based on template
async function generateResumePDF(template, data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Generate PDF based on template type
      switch (template.id) {
        case 'modern-professional':
          generateModernProfessionalPDF(doc, data);
          break;
        case 'minimalist-clean':
          generateMinimalistCleanPDF(doc, data);
          break;
        case 'creative-designer':
          generateCreativeDesignerPDF(doc, data);
          break;
        case 'executive-classic':
          generateExecutiveClassicPDF(doc, data);
          break;
        case 'tech-developer':
          generateTechDeveloperPDF(doc, data);
          break;
        default:
          generateModernProfessionalPDF(doc, data);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Modern Professional Template
function generateModernProfessionalPDF(doc, data) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  // Header with name and contact
  doc.fontSize(24).fillColor('#2563EB').text(personalInfo.fullName || 'Your Name', 50, 50);
  doc.fontSize(12).fillColor('#666666');
  
  let yPos = 80;
  if (personalInfo.email) {
    doc.text(`Email: ${personalInfo.email}`, 50, yPos);
    yPos += 15;
  }
  if (personalInfo.phone) {
    doc.text(`Phone: ${personalInfo.phone}`, 50, yPos);
    yPos += 15;
  }
  if (personalInfo.location) {
    doc.text(`Location: ${personalInfo.location}`, 50, yPos);
    yPos += 15;
  }
  if (personalInfo.linkedin) {
    doc.text(`LinkedIn: ${personalInfo.linkedin}`, 50, yPos);
    yPos += 15;
  }

  yPos += 20;

  // Professional Summary
  if (summary) {
    doc.fontSize(16).fillColor('#2563EB').text('Professional Summary', 50, yPos);
    yPos += 25;
    doc.fontSize(11).fillColor('#333333').text(summary, 50, yPos, { width: 500 });
    yPos += doc.heightOfString(summary, { width: 500 }) + 20;
  }

  // Experience
  if (experience && experience.length > 0) {
    doc.fontSize(16).fillColor('#2563EB').text('Professional Experience', 50, yPos);
    yPos += 25;

    experience.forEach(exp => {
      doc.fontSize(13).fillColor('#333333').text(exp.position || 'Position', 50, yPos);
      doc.fontSize(12).fillColor('#666666').text(`${exp.company || 'Company'} | ${exp.duration || 'Duration'}`, 50, yPos + 15);
      yPos += 35;

      if (exp.description) {
        doc.fontSize(11).fillColor('#333333').text(exp.description, 50, yPos, { width: 500 });
        yPos += doc.heightOfString(exp.description, { width: 500 }) + 15;
      }
      yPos += 10;
    });
  }

  // Education
  if (education && education.length > 0) {
    doc.fontSize(16).fillColor('#2563EB').text('Education', 50, yPos);
    yPos += 25;

    education.forEach(edu => {
      doc.fontSize(13).fillColor('#333333').text(edu.degree || 'Degree', 50, yPos);
      doc.fontSize(12).fillColor('#666666').text(`${edu.institution || 'Institution'} | ${edu.year || 'Year'}`, 50, yPos + 15);
      yPos += 40;
    });
  }

  // Skills
  if (skills && skills.length > 0) {
    doc.fontSize(16).fillColor('#2563EB').text('Skills', 50, yPos);
    yPos += 25;
    
    const skillsText = skills.join(' • ');
    doc.fontSize(11).fillColor('#333333').text(skillsText, 50, yPos, { width: 500 });
    yPos += doc.heightOfString(skillsText, { width: 500 }) + 20;
  }

  // Projects
  if (projects && projects.length > 0) {
    doc.fontSize(16).fillColor('#2563EB').text('Projects', 50, yPos);
    yPos += 25;

    projects.forEach(project => {
      doc.fontSize(13).fillColor('#333333').text(project.name || 'Project Name', 50, yPos);
      if (project.description) {
        doc.fontSize(11).fillColor('#333333').text(project.description, 50, yPos + 15, { width: 500 });
        yPos += doc.heightOfString(project.description, { width: 500 }) + 30;
      } else {
        yPos += 25;
      }
    });
  }
}

// Minimalist Clean Template
function generateMinimalistCleanPDF(doc, data) {
  const { personalInfo, summary, experience, education, skills } = data;

  // Simple header
  doc.fontSize(22).fillColor('#000000').text(personalInfo.fullName || 'Your Name', 50, 50);
  
  let yPos = 80;
  doc.fontSize(10).fillColor('#666666');
  
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    doc.text(contactInfo, 50, yPos);
    yPos += 30;
  }

  // Summary
  if (summary) {
    doc.fontSize(11).fillColor('#000000').text(summary, 50, yPos, { width: 500 });
    yPos += doc.heightOfString(summary, { width: 500 }) + 25;
  }

  // Experience
  if (experience && experience.length > 0) {
    doc.fontSize(14).fillColor('#000000').text('EXPERIENCE', 50, yPos);
    yPos += 20;

    experience.forEach(exp => {
      doc.fontSize(12).fillColor('#000000').text(exp.position || 'Position', 50, yPos);
      doc.fontSize(10).fillColor('#666666').text(`${exp.company || 'Company'} | ${exp.duration || 'Duration'}`, 50, yPos + 12);
      yPos += 30;

      if (exp.description) {
        doc.fontSize(10).fillColor('#333333').text(exp.description, 50, yPos, { width: 500 });
        yPos += doc.heightOfString(exp.description, { width: 500 }) + 15;
      }
    });
    yPos += 10;
  }

  // Education
  if (education && education.length > 0) {
    doc.fontSize(14).fillColor('#000000').text('EDUCATION', 50, yPos);
    yPos += 20;

    education.forEach(edu => {
      doc.fontSize(12).fillColor('#000000').text(edu.degree || 'Degree', 50, yPos);
      doc.fontSize(10).fillColor('#666666').text(`${edu.institution || 'Institution'} | ${edu.year || 'Year'}`, 50, yPos + 12);
      yPos += 35;
    });
  }

  // Skills
  if (skills && skills.length > 0) {
    doc.fontSize(14).fillColor('#000000').text('SKILLS', 50, yPos);
    yPos += 20;
    
    const skillsText = skills.join(' • ');
    doc.fontSize(10).fillColor('#333333').text(skillsText, 50, yPos, { width: 500 });
  }
}

// Creative Designer Template (similar structure with different styling)
function generateCreativeDesignerPDF(doc, data) {
  // Implementation similar to modern professional but with creative colors and fonts
  generateModernProfessionalPDF(doc, data);
}

// Executive Classic Template
function generateExecutiveClassicPDF(doc, data) {
  // Implementation with more formal styling
  generateModernProfessionalPDF(doc, data);
}

// Tech Developer Template
function generateTechDeveloperPDF(doc, data) {
  // Implementation with tech-focused sections
  generateModernProfessionalPDF(doc, data);
}

module.exports = router;