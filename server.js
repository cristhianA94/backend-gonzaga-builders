/**
 * Gonzaga Professional Builders - Backend API
 * Node.js + Express + Resend
 * 
 * Endpoints:
 * - POST /api/send-contact - Contact form submission
 * - POST /api/newsletter - Newsletter subscription (Desactivada)
 * - GET /api/health - Health check
 */

import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow frontend domain
const allowedOrigins = [
    'https://gonzagabuilders.com',
    'https://www.gonzagabuilders.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.FRONTEND_URL === origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
// PROD
app.use(cors(corsOptions));
//DEV
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resend email service configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend API key on startup
if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not configured');
} else {
    console.log('✅ Resend email service configured');
}

// Service mapping
const SERVICES = {
    'bathroom': 'Bathrooms',
    'kitchen': 'Kitchens',
    'basement': 'Basements',
    'deck': 'Decks',
    'extensions': 'Extensions',
    'carpentry': 'Custom Carpentry'
};

// Validation function
function validateContactForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Invalid email address');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }

    if (!data.service || !Object.keys(SERVICES).includes(data.service)) {
        errors.push('Invalid service selected');
    }

    return errors;
}

// Client email template
function getClientEmailHtml(name, email, phone, service, message) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            color: #2A2A2A; 
            background-color: #F5F5F5;
            line-height: 1.6;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #FFFFFF;
        }
        .header { 
            background: linear-gradient(135deg, #0d1e3c 0%, #0d1e3c 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #e6af2a;
        }
        .header-logo {
            max-width: 250px;
            height: auto;
            margin: -50px 0 -20px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .header h1 { 
            color: #FFFFFF;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px 0;
        }
        .header p {
            color: #e6af2a;
            font-size: 14px;
            margin: 0;
            font-weight: 500;
        }
        .content { 
            padding: 40px 30px;
            background-color: #FFFFFF;
        }
        .content h2 {
            font-family: 'Playfair Display', Georgia, serif;
            color: #0d1e3c;
            font-size: 24px;
            margin-bottom: 16px;
        }
        .content p {
            margin-bottom: 16px;
            color: #2A2A2A;
            font-size: 15px;
        }
        .info-box { 
            background: #F5F5F5;
            padding: 24px;
            border-left: 4px solid #e6af2a;
            margin: 24px 0;
            border-radius: 4px;
        }
        .info-box h3 {
            font-family: 'Playfair Display', Georgia, serif;
            color: #0d1e3c;
            font-size: 18px;
            margin: 0 0 16px 0;
        }
        .info-box p {
            margin: 8px 0;
            font-size: 14px;
        }
        .info-box strong {
            color: #0d1e3c;
            font-weight: 600;
        }
        .contact-info {
            background: #0d1e3c;
            color: #FFFFFF;
            padding: 24px;
            border-radius: 4px;
            margin: 24px 0;
        }
        .contact-info h3 {
            color: #e6af2a;
            font-size: 16px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .contact-info ul {
            list-style: none;
            padding: 0;
        }
        .contact-info li {
            margin: 8px 0;
            font-size: 14px;
            display: flex;
            align-items: center;
        }
        .contact-info a {
            color: #e6af2a;
            text-decoration: none;
            font-weight: 500;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        .btn { 
            display: inline-block;
            background: #e6af2a;
            color: #0d1e3c;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 15px;
            margin: 20px 0;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #d19d24;
            transform: translateY(-2px);
        }
        .highlight {
            background: #fff3cd;
            padding: 16px;
            border-left: 3px solid #e6af2a;
            margin: 20px 0;
            border-radius: 4px;
        }
        .highlight strong {
            color: #0d1e3c;
        }
        .footer { 
            text-align: center;
            padding: 30px;
            background-color: #F5F5F5;
            border-top: 1px solid #E0E0E0;
        }
        .footer p {
            font-size: 12px;
            color: #666666;
            margin: 4px 0;
        }
        .social-links {
            margin: 16px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #0d1e3c;
            font-size: 20px;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .content, .header, .footer {
                padding: 20px !important;
            }
            .header h1 {
                font-size: 22px !important;
            }
            .btn {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://res.cloudinary.com/dogoadody/image/upload/v1768520845/logo_cliente_trans_sm_ojkywa.png" alt="Gonzaga Professional Builders" class="header-logo">
            <h1>Gonzaga Professional Builders Inc</h1>
            <p>Quality Remodeling & Construction in Long Island, NY</p>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for contacting us! 😊</p>
            <p>We have successfully received your inquiry and our team of experts will review it shortly.</p>
            <div class="info-box">
                <h3>📋 Your Inquiry Summary:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Service Requested:</strong> ${SERVICES[service] || service}</p>
                <p><strong>Message:</strong><br>${message}</p>
            </div>
            <div class="highlight">
                <p>⏱️ <strong>Response Time:</strong> We will contact you within <strong>24 hours</strong> to provide you with a personalized proposal.</p>
            </div>
            <div class="contact-info">
                <h3>Need Immediate Assistance?</h3>
                <ul>
                    <li>📞 Phone: <a href="tel:+16313391584">631-339-1584</a></li>
                    <li>📧 Email: <a href="mailto:info@gonzagabuilders.com">info@gonzagabuilders.com</a></li>
                    <li>📍 Location: 3006 Watch Hill Ave, Medford, NY 11763</li>
                    <li>🕒 Hours: Mon-Fri 8:00 AM - 6:00 PM | Sat 8:00 AM - 3:00 PM</li>
                </ul>
            </div>
            <p style="text-align: center;">
                <a href="https://gonzagabuilders.com" class="btn">Visit Our Website</a>
            </p>
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Why Choose Gonzaga Professional Builders?</strong><br>
                ✅ 10+ years of experience in Long Island<br>
                ✅ Licensed and insured contractor<br>
                ✅ Free estimates with no obligation<br>
                ✅ Quality workmanship guaranteed<br>
                ✅ Transparent pricing and communication
            </p>
        </div>
        <div class="footer">
            <div class="social-links">
                <a href="https://www.facebook.com/GonzagaProfessionalBuilders/" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/gonzagaprofessionalbuilders" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com/@gonzagaprobuilders" title="TikTok"><i class="fab fa-tiktok"></i></a>
            </div>
            <p><strong>Gonzaga Professional Builders Inc</strong></p>
            <p>&copy; 2024 All rights reserved.</p>
            <p>Serving Long Island, Suffolk County, and Nassau County, NY</p>
            <p style="margin-top: 12px; font-size: 11px;">
                This is an automated email. Please do not reply to this message.<br>
                For assistance, contact us at info@gonzagabuilders.com
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Admin email template
function getAdminEmailHtml(name, email, phone, service, message) {
    const timestamp = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            color: #2A2A2A; 
            background-color: #F5F5F5;
            line-height: 1.6;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #FFFFFF;
        }
        .header { 
            background: linear-gradient(135deg, #0d1e3c 0%, #0d1e3c 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #e6af2a;
        }
        .header-logo {
            max-width: 200px;
            height: auto;
            margin: -30px 0 -10px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .header h1 { 
            color: #FFFFFF;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            font-weight: 700;
            margin: 0;
        }
        .header .badge {
            display: inline-block;
            background: #e6af2a;
            color: #0d1e3c;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 12px;
        }
        .content { 
            padding: 40px 30px;
            background-color: #FFFFFF;
        }
        .alert-box {
            background: #fff3cd;
            border-left: 4px solid #e6af2a;
            padding: 20px;
            margin-bottom: 24px;
            border-radius: 4px;
        }
        .alert-box h2 {
            font-family: 'Playfair Display', Georgia, serif;
            color: #0d1e3c;
            font-size: 22px;
            margin-bottom: 8px;
        }
        .alert-box p {
            color: #2A2A2A;
            font-size: 14px;
            margin: 0;
        }
        .info-section { 
            background: #F5F5F5;
            padding: 24px;
            border-left: 4px solid #e6af2a;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-section h3 {
            font-family: 'Playfair Display', Georgia, serif;
            color: #0d1e3c;
            font-size: 18px;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
        }
        .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #E0E0E0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #0d1e3c;
            min-width: 120px;
            font-size: 14px;
        }
        .info-value {
            color: #2A2A2A;
            font-size: 14px;
            flex: 1;
        }
        .info-value a {
            color: #0d1e3c;
            text-decoration: none;
            font-weight: 500;
        }
        .info-value a:hover {
            color: #e6af2a;
            text-decoration: underline;
        }
        .message-box {
            background: #FFFFFF;
            border: 2px solid #e6af2a;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .message-box h3 {
            font-family: 'Playfair Display', Georgia, serif;
            color: #0d1e3c;
            font-size: 18px;
            margin: 0 0 12px 0;
        }
        .message-content {
            background: #F5F5F5;
            padding: 16px;
            border-radius: 4px;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
            color: #2A2A2A;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .btn { 
            display: inline-block;
            background: #e6af2a;
            color: #0d1e3c;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 15px;
            margin: 8px;
        }
        .btn-secondary {
            background: #0d1e3c;
            color: #FFFFFF;
        }
        .timestamp-box {
            background: #0d1e3c;
            color: #FFFFFF;
            padding: 16px;
            text-align: center;
            border-radius: 4px;
            margin-top: 24px;
        }
        .timestamp-box p {
            margin: 4px 0;
            font-size: 13px;
        }
        .timestamp-box .time {
            color: #e6af2a;
            font-weight: 600;
            font-size: 16px;
        }
        .footer { 
            text-align: center;
            padding: 24px 30px;
            background-color: #F5F5F5;
            border-top: 1px solid #E0E0E0;
        }
        .footer p {
            font-size: 12px;
            color: #666666;
            margin: 4px 0;
        }
        @media only screen and (max-width: 600px) {
            .content, .header, .footer {
                padding: 20px !important;
            }
            .header h1 {
                font-size: 20px !important;
            }
            .info-row {
                flex-direction: column;
            }
            .info-label {
                margin-bottom: 4px;
            }
            .btn {
                display: block;
                margin: 8px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://res.cloudinary.com/dogoadody/image/upload/v1768520845/logo_cliente_trans_sm_ojkywa.png" alt="Gonzaga Professional Builders" class="header-logo">
            <h1>🔔 NEW CONTACT</h1>
            <span class="badge">ADMINISTRATOR NOTIFICATION</span>
        </div>
        <div class="content">
            <div class="alert-box">
                <h2>📬 You have received a new inquiry</h2>
                <p>A potential client has contacted you through the web form. Review the details below and respond as soon as possible.</p>
            </div>
            <div class="info-section">
                <h3>👤 Client Information</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${phone ? `<a href="tel:${phone}">${phone}</a>` : 'Not provided'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Service:</span>
                    <span class="info-value">${SERVICES[service] || service}</span>
                </div>
            </div>
            <div class="message-box">
                <h3>💬 Client Message</h3>
                <div class="message-content">${message}</div>
            </div>
            <div class="action-buttons">
                <a href="mailto:${email}" class="btn">📧 Reply by Email</a>
                ${phone ? `<a href="tel:${phone}" class="btn btn-secondary">📞 Call Client</a>` : ''}
            </div>
            <div class="timestamp-box">
                <p>Reception date and time:</p>
                <p class="time">${timestamp}</p>
            </div>
        </div>
        <div class="footer">
            <p><strong>Gonzaga Professional Builders Inc</strong></p>
            <p style="margin-top: 8px; color: #999;">
                This is an automated email from the web contact system.<br>
                Please respond to the client within the next 24 hours to maintain quality service.
            </p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * POST /api/send-contact
 * Contact form submission endpoint
 */
app.post('/api/send-contact', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        // Validate form data
        const errors = validateContactForm({ name, email, message, service });
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                detalles: errors
            });
        }

        // Send confirmation email to client
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Gonzaga Builders <onboarding@resend.dev>',
            to: email,
            subject: 'We Received Your Inquiry - Gonzaga Professional Builders Inc',
            html: getClientEmailHtml(name, email, phone, service, message)
        });
        console.log('✅ Email sent to client:', email);

        // Send notification email to admin
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Gonzaga Builders <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact from ${name}`,
            html: getAdminEmailHtml(name, email, phone, service, message)
        });
        console.log('✅ Notification sent to admin');

        res.json({
            success: true,
            message: 'Inquiry sent successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send contact email',
            detalles: 'An unexpected error occurred while processing your request.'
        });
    }
});

/**
 * POST /api/newsletter
 * Newsletter subscription endpoint
 */
/** 
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }

        await transporter.sendMail({
            from: `"Gonzaga Builders" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '✅ Welcome to Gonzaga Builders Newsletter!',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0d1e3c, #0d1e3c); color: white; padding: 20px; border-radius: 8px; text-align: center; border-bottom: 4px solid #e6af2a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Welcome!</h1>
        </div>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will receive updates about our projects, construction tips, and special offers.</p>
        <p>Best regards,<br><strong>Gonzaga Builders Team</strong></p>
    </div>
</body>
</html>`
        });

        console.log('✅ Newsletter subscription:', email);

        res.json({
            success: true,
            message: 'Subscription successful'
        });

    } catch (error) {
        console.error('❌ Newsletter error:', error);
        res.status(500).json({
            success: false,
            error: 'Error processing subscription'
        });
    }
});
*/

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Gonzaga Professional Builders API',
        timestamp: new Date().toISOString()
    });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   🏗️  Gonzaga Builders API                 ║
║   ✅  Server running on port ${PORT}         ║
║   📧  Email service configured            ║
║   🌐  CORS: ${process.env.FRONTEND_URL || 'Not configured'}   ║
╚═══════════════════════════════════════════╝
    `);
});

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled rejection:', err);
});
