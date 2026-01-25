# Gonzaga Builders - Backend API

Backend API for Gonzaga Professional Builders website. Handles contact form submissions and newsletter subscriptions via email.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Run development server
npm run dev

# Run production server
npm start
```

## 📧 Environment Variables

Create a `.env` file with the following variables:

```env
# Gmail SMTP Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Admin notification email
ADMIN_EMAIL=admin@gonzagabuilders.com

# Server configuration
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=https://gonzagabuilders.com
```

### Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password for "Mail"
5. Use the 16-character password in `EMAIL_PASSWORD`

## 📡 API Endpoints

### POST `/api/send-contact`
Contact form submission. Sends confirmation email to client and notification to admin.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "631-555-0123",
  "service": "bathroom",
  "message": "I need a bathroom remodel..."
}
```

**Valid services:** `bathroom`, `kitchen`, `basement`, `deck`, `extensions`, `carpentry`

**Response:**
```json
{
  "success": true,
  "message": "Inquiry sent successfully",
  "timestamp": "2026-01-16T12:00:00.000Z"
}
```


### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "service": "Gonzaga Builders API",
  "timestamp": "2026-01-16T12:00:00.000Z"
}
```

## 🚀 Deployment

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Deploy to Render

1. Create a new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Deploy to Vercel (Serverless)

For serverless deployment, you'll need to convert to Vercel serverless functions.

## 🔒 Security Notes

- Never commit `.env` file
- Use environment variables for all secrets
- CORS is configured to only allow requests from `FRONTEND_URL`
- Input validation on all endpoints

## 📁 Project Structure

```
gonzaga-backend/
├── server.js           # Main API server
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Node.js** 18+
- **Express** - Web framework
- **Nodemailer** - Email sending
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 📞 Support

For issues or questions, contact the development team.

---

**Repository:** GitHub (Private)  
**Frontend:** GitLab  
**Last Updated:** January 2026
