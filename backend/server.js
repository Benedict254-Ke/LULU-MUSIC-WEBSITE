const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// DEBUG: Check .env loading
console.log('🔍 Environment check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set (' + process.env.EMAIL_PASS.length + ' chars)' : '✗ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Middleware
const allowedOrigins = [
  'https://lulu-b-music-website.vercel.app',
  'https://www.lulubmusic.com', // If you have a custom domain
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// ============ ADD THIS MISSING SECTION ============
// Email configuration using .env values
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : ''
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Alternative Gmail configuration (backup)
const altTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : ''
  },
  tls: {
    rejectUnauthorized: false
  }
});
// ============ END OF MISSING SECTION ============

// Test email configuration
let activeTransporter = transporter;

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Primary email config failed:', error.message);
    console.log('🔄 Trying alternative Gmail config...');
    
    altTransporter.verify((altError, altSuccess) => {
      if (altError) {
        console.log('❌ Alternative config also failed:', altError.message);
        console.log('\n🔑 Gmail Authentication Troubleshooting:');
        console.log('1. Check if 2-Step Verification is enabled');
        console.log('2. Generate App Password at: https://myaccount.google.com/apppasswords');
        console.log('3. Select "Mail" and "Other (Custom name)"');
        console.log('4. Name it "Node.js Backend"');
        console.log('5. Copy the 16-character password (no spaces)');
        console.log('6. Update .env file with the password');
        console.log('7. Make sure password has NO spaces');
        console.log('Current password length:', process.env.EMAIL_PASS?.length || 0);
      } else {
        console.log('✅ Alternative Gmail config works! Using it...');
        activeTransporter = altTransporter;
      }
    });
  } else {
    console.log('✅ Primary email config works!');
    activeTransporter = transporter;
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('\n📨 Contact form submission received from:', email);

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // Email content for you (the owner)
    const ownerMailOptions = {
      from: `"Lulu B Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `🎵 New Contact: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00aaff; text-align: center; border-bottom: 2px solid #00aaff; padding-bottom: 10px;">
            🎵 New Website Contact
          </h2>
          
          <div style="background: linear-gradient(to right, #667eea, #764ba2); padding: 15px; border-radius: 8px; color: white; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">👤 ${name}</h3>
            <p style="margin: 0; font-size: 14px;">📧 ${email}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">📝 Message:</h4>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00aaff; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" 
               style="background-color: #00aaff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              ✉️ Reply to ${name}
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee;">
            ⏰ ${new Date().toLocaleString()} • Lulu B Website Contact Form
          </p>
        </div>
      `
    };

    // Auto-reply to the sender
    const autoReplyMailOptions = {
      from: `"Lulu B" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎵 Thank you for contacting Lulu B!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #00aaff;">
            <h1 style="color: #00aaff; margin: 0; font-size: 28px;">🎵 Lulu B</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0;">Musician & Artist</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name} 👋</h2>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out! I've received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 15px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">📝 Your message:</p>
              <p style="color: #666; margin: 0; font-style: italic; line-height: 1.5; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
                "${message}"
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              While you wait, check out my music and social media:
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 25px 0;">
              <a href="https://www.instagram.com/lulu_b_254/" 
                 style="background: linear-gradient(45deg, #405DE6, #E1306C); color: white; padding: 12px; border-radius: 5px; text-decoration: none; text-align: center; font-weight: bold;">
                Instagram
              </a>
              <a href="https://www.facebook.com/lulua.ben" 
                 style="background-color: #1877F2; color: white; padding: 12px; border-radius: 5px; text-decoration: none; text-align: center; font-weight: bold;">
                Facebook
              </a>
              <a href="https://soundcloud.com/lulu-b-526989834" 
                 style="background-color: #FF5500; color: white; padding: 12px; border-radius: 5px; text-decoration: none; text-align: center; font-weight: bold;">
                SoundCloud
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-top: 20px;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              ⚡ This is an automated response. For urgent matters, please WhatsApp: +254 103 615 042
            </p>
            <p style="color: #aaa; font-size: 12px; margin: 10px 0 0 0;">
              &copy; ${new Date().getFullYear()} Lulu B • Nairobi, Kenya
            </p>
          </div>
        </div>
      `
    };

    console.log('📤 Sending emails...');
    
    // Send both emails
    const ownerResult = await activeTransporter.sendMail(ownerMailOptions);
    console.log('✅ Email sent to you:', ownerResult.messageId);
    
    const autoReplyResult = await activeTransporter.sendMail(autoReplyMailOptions);
    console.log('✅ Auto-reply sent to sender:', autoReplyResult.messageId);

    console.log(`🎉 Contact form completed for ${name} (${email})`);

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Error code:', error.code);
    
    let errorMessage = 'Failed to send message. Please try again later.';
    let statusCode = 500;
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check the email configuration.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.responseCode === 550) {
      errorMessage = 'Email rejected. Please check the email address.';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage
    });
  }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: `"Lulu B Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '✅ Backend Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #00aaff;">✅ Email Test Successful!</h2>
          <p>Your Lulu B website backend is correctly configured to send emails.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
        </div>
      `
    };
    
    const info = await activeTransporter.sendMail(testMailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email: ' + error.message,
      code: error.code
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Lulu B Contact Form API',
    version: '1.0.0',
    endpoints: {
      contact: 'POST /api/contact',
      health: 'GET /api/health',
      test: 'GET /api/test',
      testEmail: 'POST /api/test-email'
    },
    emailConfigured: !!process.env.EMAIL_USER
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Lulu B Music Website Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Backend is operational!',
    data: {
      emailConfigured: !!process.env.EMAIL_USER,
      corsOrigin: ['https://lulu-b-music-website.vercel.app', 'http://localhost:3000'],
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: https://lulu-b-music-website.vercel.app`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  /              - API information`);
  console.log(`   GET  /api/health    - Health check`);
  console.log(`   GET  /api/test      - Test endpoint`);
  console.log(`   POST /api/contact   - Contact form`);
  console.log(`   POST /api/test-email - Test email`);
  console.log(`\n🔍 Waiting for email configuration test...`);
});