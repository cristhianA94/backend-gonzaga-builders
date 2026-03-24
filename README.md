# Gonzaga Builders - Backend API

Backend API for Gonzaga Professional Builders website. Handles contact form submissions via email using Resend.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

## 📧 Environment Variables

Create a `.env` file with the following variables:

```env
# Resend API Key (Get from https://resend.com/api-keys)
RESEND_API_KEY=re_your_api_key_here

# Email Configuration
# Use onboarding@resend.dev if domain not verified, or info@gonzagabuilders.com if verified
EMAIL_FROM=Gonzaga Builders <info@gonzagabuilders.com>
ADMIN_EMAIL=info@gonzagabuilders.com

# Frontend URL (for CORS)
FRONTEND_URL=https://www.gonzagabuilders.com

# Server configuration
PORT=3000
```

### Resend Setup (Email Service)

1. **Create Resend Account** (Free - 3,000 emails/month)
   - Go to [resend.com/signup](https://resend.com/signup)
   - Sign up and verify your email

2. **Get API Key**
   - Visit [resend.com/api-keys](https://resend.com/api-keys)
   - Click "Create API Key"
   - Copy the key (starts with `re_...`)

3. **Verify Domain** (Optional but recommended)
   - Go to [resend.com/domains](https://resend.com/domains)
   - Add `gonzagabuilders.com`
   - Follow DNS configuration instructions
   - Until verified, use `onboarding@resend.dev` as `EMAIL_FROM`

**Why Resend?**
- ✅ No SMTP port blocking issues (works on Railway, Vercel, etc.)
- ✅ Better email deliverability
- ✅ 3,000 emails/month free
- ✅ Dashboard with email logs
- ✅ Professional email service

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
- **Resend** - Email delivery service
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 🔧 Troubleshooting

### Emails not sending
- Verify `RESEND_API_KEY` is correct
- Check [Resend Dashboard](https://resend.com/emails) for logs
- Ensure `EMAIL_FROM` uses verified domain or `onboarding@resend.dev`

### CORS errors
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Include `www` if your site uses it: `https://www.gonzagabuilders.com`

### Connection issues
- Railway/Render: Check environment variables are set correctly
- Local: Ensure `.env` file exists and is properly formatted

## 📚 Additional Documentation

- [Resend Docs](https://resend.com/docs) - Official Resend documentation

---

**Repository:** [GitHub](https://github.com/cristhianA94/backend-gonzaga-builders)  
**Frontend:** GitLab (Private)  
**Last Updated:** January 2026
