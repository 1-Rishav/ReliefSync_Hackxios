# ReliefSync - Server Application

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.15.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

A robust Node.js backend API for the ReliefSync disaster relief management platform with AI/ML integrations.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [AI & ML Integrations](#-ai--ml-integrations)
- [Features](#-features)
- [API Architecture](#-api-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Security Features](#-security-features)

---

## 🎯 Overview

The ReliefSync Server is a comprehensive Node.js/Express backend that powers the disaster relief management platform. It provides RESTful APIs for authentication, disaster reporting, resource management, real-time communication, and integrates with various AI/ML services for disaster prediction and analysis.

---

## 🛠 Tech Stack

### Core Framework
| Technology | Version | Description |
|------------|---------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | 18+ | JavaScript Runtime |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | 5.1.0 | Web Framework |

### Database
| Technology | Version | Description |
|------------|---------|-------------|
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | 6.16.0 | NoSQL Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) | 8.15.0 | MongoDB ODM |

### Authentication & Security
| Technology | Version | Description |
|------------|---------|-------------|
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | 9.0.2 | Token Authentication |
| ![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=flat&logo=letsencrypt&logoColor=white) | 6.0.0 | Password Hashing |
| ![Helmet](https://img.shields.io/badge/Helmet-000000?style=flat&logo=helmet&logoColor=white) | 8.1.0 | Security Headers |
| ![CORS](https://img.shields.io/badge/CORS-FF6B6B?style=flat&logo=cors&logoColor=white) | 2.8.5 | Cross-Origin Resource Sharing |

### Real-time Communication
| Technology | Version | Description |
|------------|---------|-------------|
| ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white) | 4.8.1 | Real-time Events |

### AI & Machine Learning
| Technology | Version | Description |
|------------|---------|-------------|
| ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white) | 6.6.0 | AI Text Processing |
| ![Google Earth Engine](https://img.shields.io/badge/Earth_Engine-4285F4?style=flat&logo=googleearth&logoColor=white) | 1.5.24 | Satellite Data Analysis |

### File & Media Processing
| Technology | Version | Description |
|------------|---------|-------------|
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) | 2.7.0 | Cloud Media Storage |
| ![Multer](https://img.shields.io/badge/Multer-FF6600?style=flat&logo=files&logoColor=white) | 1.4.5 | File Upload Handling |
| ![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=flat&logo=ffmpeg&logoColor=white) | 5.3.0 | Audio/Video Processing |

### Payment Integration
| Technology | Version | Description |
|------------|---------|-------------|
| ![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat&logo=razorpay&logoColor=white) | 2.9.6 | Payment Gateway |

### Geospatial
| Technology | Version | Description |
|------------|---------|-------------|
| ![H3](https://img.shields.io/badge/H3_Geo-1C1C1C?style=flat&logo=uber&logoColor=white) | 4.2.1 | Hexagonal Geospatial Indexing |
| ![is-sea](https://img.shields.io/badge/is--sea-0077B5?style=flat&logo=water&logoColor=white) | 0.3.1 | Sea/Land Detection |

### Utilities
| Technology | Version | Description |
|------------|---------|-------------|
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | 1.13.2 | HTTP Client |
| ![QRCode](https://img.shields.io/badge/QRCode-000000?style=flat&logo=qrcode&logoColor=white) | 1.5.4 | QR Code Generation |
| ![Cron](https://img.shields.io/badge/Cron-000000?style=flat&logo=clockify&logoColor=white) | 4.3.3 | Scheduled Tasks |
| ![UUID](https://img.shields.io/badge/UUID-000000?style=flat&logo=uuid&logoColor=white) | 13.0.0 | Unique ID Generation |
| ![Morgan](https://img.shields.io/badge/Morgan-000000?style=flat&logo=files&logoColor=white) | 1.10.0 | HTTP Request Logger |

---

## 📁 Project Structure

```
Server/
├── 📁 config/                          # Configuration files
│   └── reliefsync-service-account.json # Google Cloud service account
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 controllers/                 # Route handlers (Business Logic)
│   │   ├── admin.controller.js        # Admin operations
│   │   ├── agent.controller.js        # Government agent operations
│   │   ├── auth.controller.js         # Authentication & authorization
│   │   ├── disasterReport.controller.js # Disaster reporting logic
│   │   ├── ngo.controller.js          # NGO operations
│   │   ├── notification.controller.js # Push notifications
│   │   ├── QrCode.controller.js       # QR code generation
│   │   ├── razorpay.controller.js     # Payment processing
│   │   ├── user.controller.js         # User management
│   │   └── weatherCheck.controller.js # Weather & disaster prediction
│   │
│   ├── 📁 db/                          # Database configuration
│   │   └── index.js                   # MongoDB connection setup
│   │
│   ├── 📁 Helper/                      # Helper functions & utilities
│   │   ├── audioConverter.js          # FFmpeg audio conversion
│   │   ├── disasterAPIs.js            # External disaster data APIs
│   │   ├── fetchFloodReport.js        # Flood data fetching
│   │   ├── generateTiles.js           # Map tile generation
│   │   └── uploadPinata.js            # IPFS/Pinata file upload
│   │
│   ├── 📁 middleware/                  # Express middleware
│   │   ├── authMiddleware.js          # JWT authentication
│   │   └── multer.js                  # File upload configuration
│   │
│   ├── 📁 models/                      # Mongoose schemas/models
│   │   ├── agent.model.js             # Government agent schema
│   │   ├── areaDisaster.model.js      # Disaster area data
│   │   ├── auth.model.js              # User authentication
│   │   ├── coordinates.model.js       # Geolocation data
│   │   ├── emergency.model.js         # Emergency requests
│   │   ├── feedback.model.js          # User feedback
│   │   ├── ngo.model.js               # NGO organization data
│   │   ├── predictionData.model.js    # AI prediction results
│   │   ├── qrcode.model.js            # QR code tracking
│   │   └── tokenBlackList.model.js    # Revoked JWT tokens
│   │
│   ├── 📁 routes/                      # API route definitions
│   │   ├── admin.route.js             # /api/admin/*
│   │   ├── agent.route.js             # /api/agent/*
│   │   ├── auth.route.js              # /api/auth/*
│   │   ├── disasterReport.route.js    # /api/disaster/*
│   │   ├── index.route.js             # Route aggregator
│   │   ├── ngo.route.js               # /api/ngo/*
│   │   ├── notification.route.js      # /api/notification/*
│   │   ├── qrCode.route.js            # /api/qrcode/*
│   │   ├── razorpay.route.js          # /api/payment/*
│   │   ├── user.route.js              # /api/user/*
│   │   └── weatherCheck.route.js      # /api/weather/*
│   │
│   ├── 📁 Templates/                   # Email & notification templates
│   │   └── 📁 Mail/                    # Email HTML templates
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   ├── catchAsync.js              # Async error wrapper
│   │   └── filterObj.js               # Object filtering utility
│   │
│   ├── app.js                         # Express app configuration
│   └── index.js                       # Server entry point
│
├── .env                               # Environment variables
├── .gitignore                         # Git ignore rules
├── IndiaData.js                       # India geographic data
├── package.json                       # Dependencies & scripts
└── README.md                          # This file
```

---

## 🤖 AI & ML Integrations

### OpenAI Integration
| Feature | Description |
|---------|-------------|
| **Text Analysis** | Analyze disaster reports for severity and urgency |
| **Content Generation** | Generate emergency alerts and notifications |
| **Language Processing** | Process voice mail transcriptions |
| **Smart Categorization** | Auto-categorize disaster types and needs |

### Google Earth Engine
| Feature | Description |
|---------|-------------|
| **Satellite Imagery** | Real-time satellite data analysis |
| **Flood Detection** | Identify flooded areas from satellite images |
| **Land Use Analysis** | Analyze affected land areas |
| **Historical Comparison** | Compare pre/post disaster imagery |

### Weather & Disaster Prediction
| Feature | Description |
|---------|-------------|
| **Weather APIs** | Integration with weather data providers |
| **Flood Forecasting** | Predict potential flood events |
| **Risk Assessment** | Calculate disaster risk scores |
| **Early Warning** | Generate early warning alerts |

### Geospatial Analysis
| Feature | Description |
|---------|-------------|
| **H3 Indexing** | Hexagonal grid-based location indexing |
| **Distance Calculation** | Calculate distances between locations |
| **Area Mapping** | Map affected disaster areas |
| **Sea Detection** | Identify water bodies for flood analysis |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Citizen, NGO, Government, Admin)
- Google OAuth integration
- Email verification with OTP
- Password reset functionality
- Token blacklisting for logout

### 📊 Disaster Management
- Real-time disaster reporting
- Geolocation-based disaster tracking
- Severity classification
- Resource allocation tracking
- QR code-based resource verification

### 👥 User Management
- Multi-role user system
- Profile management
- NGO verification workflow
- Government agent verification
- Admin dashboard operations

### 💰 Payment Processing
- Razorpay integration for donations
- Payment verification
- Transaction history
- Refund handling

### 🔔 Notifications
- Push notification support
- Email notifications
- Real-time Socket.IO events
- Emergency alerts

### 📁 File Management
- Cloudinary integration for media storage
- Audio file conversion (FFmpeg)
- Image optimization
- IPFS/Pinata for decentralized storage

### 🗺️ Geospatial Features
- Location-based services
- Map tile generation
- Distance calculations
- Area boundary detection

---

## 🏗️ API Architecture

### Route Structure
```
/api
├── /auth                    # Authentication endpoints
│   ├── POST /register       # User registration
│   ├── POST /login          # User login
│   ├── POST /logout         # User logout
│   ├── POST /verify-email   # Email verification
│   ├── POST /forgot-password # Password reset request
│   └── POST /reset-password # Password reset
│
├── /user                    # User management
│   ├── GET /profile         # Get user profile
│   ├── PATCH /profile       # Update profile
│   └── GET /dashboard       # User dashboard data
│
├── /disaster                # Disaster reporting
│   ├── POST /report         # Submit disaster report
│   ├── GET /reports         # Get all reports
│   ├── GET /reports/:id     # Get specific report
│   └── GET /nearby          # Get nearby disasters
│
├── /ngo                     # NGO operations
│   ├── GET /tasks           # Get assigned tasks
│   ├── POST /delivery       # Mark delivery complete
│   └── GET /statistics      # NGO statistics
│
├── /agent                   # Government agent operations
│   ├── GET /assignments     # Get assignments
│   ├── POST /verify         # Verify deliveries
│   └── GET /area-status     # Area status report
│
├── /admin                   # Admin operations
│   ├── GET /users           # List all users
│   ├── POST /verify-ngo     # Verify NGO
│   ├── POST /verify-agent   # Verify agent
│   └── GET /analytics       # Platform analytics
│
├── /weather                 # Weather & predictions
│   ├── GET /current         # Current weather
│   ├── GET /forecast        # Weather forecast
│   └── GET /alerts          # Weather alerts
│
├── /payment                 # Payment processing
│   ├── POST /create-order   # Create payment order
│   ├── POST /verify         # Verify payment
│   └── GET /history         # Payment history
│
├── /qrcode                  # QR code operations
│   ├── POST /generate       # Generate QR code
│   └── POST /verify         # Verify QR code
│
└── /notification            # Notifications
    ├── POST /send           # Send notification
    └── GET /history         # Notification history
```

### Request/Response Flow
```
Client Request
      │
      ▼
┌─────────────────┐
│   Rate Limiter  │ ─── 100 requests/hour/IP
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Helmet      │ ─── Security headers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      CORS       │ ─── Cross-origin handling
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Body Parser    │ ─── JSON/URL parsing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Morgan      │ ─── Request logging
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware│ ─── JWT verification
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ ─── Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │ ─── MongoDB operations
└────────┬────────┘
         │
         ▼
   JSON Response
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **MongoDB** (local or Atlas connection)
- **FFmpeg** (for audio processing)

### Installation

1. **Navigate to the Server directory**
   ```bash
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the Server directory:
   ```env
   # Server Configuration
   PORT=5000
   SERVER_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/reliefsync
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # Google Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **For production**
   ```bash
   npm start
   ```

6. **Server will be running at**
   ```
   http://localhost:5000
   ```

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `SERVER_URL` | Server base URL | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `RAZORPAY_KEY_ID` | Razorpay key ID | Optional |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | Optional |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Optional |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon (auto-reload) |
| `npm start` | Start production server |
| `npm test` | Run tests (not configured) |

---

## 🔒 Security Features

### Rate Limiting
```javascript
// 100 requests per hour per IP
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 100,
    message: 'Too many requests from this IP'
});
```

### Security Headers (Helmet)
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

### Authentication
- JWT token-based authentication
- Token blacklisting for logout
- Password hashing with bcrypt
- Role-based access control

### Data Sanitization
- Express Mongo Sanitize for NoSQL injection prevention
- Input validation on all endpoints
- XSS protection

---

## 📊 Database Models

### User/Auth Model
```javascript
{
  email: String,
  password: String (hashed),
  role: ['citizen', 'ngo', 'agent', 'admin'],
  isVerified: Boolean,
  profile: {
    name: String,
    phone: String,
    location: Object
  }
}
```

### Disaster Report Model
```javascript
{
  type: String,
  severity: ['low', 'medium', 'high', 'critical'],
  location: {
    coordinates: [Number],
    address: String
  },
  description: String,
  reportedBy: ObjectId,
  status: ['pending', 'verified', 'resolved'],
  media: [String]
}
```

### Emergency Model
```javascript
{
  user: ObjectId,
  type: String,
  location: Object,
  status: String,
  assignedTo: ObjectId,
  priority: Number
}
```

---

## 🔄 Real-time Features (Socket.IO)

### Events
| Event | Description |
|-------|-------------|
| `connection` | Client connected |
| `join_donation` | Join donation room |
| `disaster_update` | New disaster reported |
| `emergency_alert` | Emergency broadcast |
| `task_assigned` | Task assignment notification |

### Usage Example
```javascript
// Server-side
io.emit('disaster_update', { 
  type: 'flood', 
  location: {...} 
});

// Client-side
socket.on('disaster_update', (data) => {
  // Handle update
});
```

---

## 📝 License

This project is part of the ReliefSync platform. See the root [LICENSE](../LICENSE) file for details.

---

<div align="center">

Made with 💙 for disaster relief coordination

</div>
