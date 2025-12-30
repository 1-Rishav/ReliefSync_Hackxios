<h1 align="center">🏗️ ReliefSync System Design Document</h1>

<p align="center">
  <strong>Comprehensive Architecture & Technical Design Specification</strong>
</p>

<p align="center">
  <em>Version 1.0 | Last Updated: December 2024</em>
</p>

---

## 📋 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Design](#6-database-design)
7. [API Design](#7-api-design)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Real-Time Communication](#9-real-time-communication)
10. [AI/ML Integration](#10-aiml-integration)
11. [External Services Integration](#11-external-services-integration)
12. [Security Architecture](#12-security-architecture)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Scalability & Performance](#14-scalability--performance)
15. [Data Flow Diagrams](#15-data-flow-diagrams)
16. [Error Handling Strategy](#16-error-handling-strategy)
17. [Monitoring & Logging](#17-monitoring--logging)

---

## 1. Executive Summary

### 1.1 Purpose
ReliefSync is a comprehensive disaster relief management platform designed to coordinate emergency response efforts between citizens, NGOs, government agencies, and field agents. The system leverages modern web technologies, AI/ML capabilities, and real-time communication to ensure efficient disaster management and resource distribution.

### 1.2 Scope
This document outlines the complete technical architecture, design decisions, data models, integration patterns, and deployment strategies for the ReliefSync platform.

### 1.3 Key Design Goals
- **Scalability**: Handle thousands of concurrent users during disaster events
- **Reliability**: 99.9% uptime with graceful degradation
- **Real-time**: Sub-second latency for critical updates
- **Security**: Enterprise-grade security for sensitive data
- **Extensibility**: Modular architecture for future enhancements


---

## 2. System Overview

### 2.1 System Context

```mermaid
graph TB
    subgraph External Users
        C[👤 Citizens]
        N[🏢 NGOs]
        G[🏛️ Government Agents]
        A[👨‍💼 Administrators]
    end

    subgraph ReliefSync Platform
        FE[React Frontend]
        BE[Node.js Backend]
        DB[(MongoDB)]
        RT[Socket.IO Server]
    end

    subgraph External Services
        GEE[Google Earth Engine]
        ML[ML Prediction APIs]
        CLD[Cloudinary]
        RP[Razorpay]
        OS[OneSignal]
        MS[MailerSend]
        GA[Google OAuth]
    end

    C --> FE
    N --> FE
    G --> FE
    A --> FE
    
    FE <--> BE
    FE <--> RT
    BE <--> DB
    BE <--> RT
    
    BE --> GEE
    BE --> ML
    BE --> CLD
    BE --> RP
    BE --> OS
    BE --> MS
    BE --> GA
```

### 2.2 User Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Citizen** | End users affected by disasters | Report disasters, request help, track relief status, submit feedback |
| **NGO** | Relief organizations | Manage relief tasks, coordinate distribution, QR-based tracking, emergency response |
| **Government Agent** | Field officers | Oversee operations, verify organizations, manage emergencies, allocate resources |
| **Admin** | Platform administrators | Full system access, user verification, analytics, system configuration |

### 2.3 Core Capabilities

| Capability | Description | Technologies |
|------------|-------------|--------------|
| **Disaster Reporting** | Real-time disaster incident reporting with geolocation | Leaflet, Geolocation API |
| **AI Prediction** | Predictive analysis for floods, wildfires, droughts, earthquakes | Google Earth Engine, ML APIs |
| **Resource Tracking** | QR code-based relief distribution tracking | QR Generation, Token Verification |
| **Real-time Updates** | Live notifications and status updates | Socket.IO, OneSignal |
| **Payment Processing** | Donation handling and fund management | Razorpay Integration |
| **Web3 Integration** | Transparent resource tracking on blockchain | RainbowKit, Wagmi, Viem |


---

## 3. High-Level Architecture

### 3.1 Architecture Overview

```mermaid
graph TB
    subgraph Client Layer
        WEB[React Web App<br/>Vite + TailwindCSS]
    end

    subgraph API Gateway Layer
        CORS[CORS Middleware]
        RATE[Rate Limiter]
        AUTH[Auth Middleware]
    end

    subgraph Application Layer
        EXPRESS[Express.js Server]
        SOCKET[Socket.IO Server]
        CRON[Cron Jobs]
    end

    subgraph Service Layer
        AUTH_SVC[Auth Service]
        USER_SVC[User Service]
        DISASTER_SVC[Disaster Service]
        NGO_SVC[NGO Service]
        AGENT_SVC[Agent Service]
        NOTIFY_SVC[Notification Service]
        PAYMENT_SVC[Payment Service]
        QR_SVC[QR Code Service]
        WEATHER_SVC[Weather/Prediction Service]
    end

    subgraph Data Layer
        MONGO[(MongoDB Atlas)]
        REDIS[(Session Store)]
    end

    subgraph External Services
        GEE[Google Earth Engine]
        FLOOD_API[Flood Prediction API]
        WILDFIRE_API[Wildfire Prediction API]
        DROUGHT_API[Drought Prediction API]
        EARTHQUAKE_API[Earthquake Prediction API]
        CLOUDINARY[Cloudinary CDN]
        RAZORPAY[Razorpay Gateway]
        ONESIGNAL[OneSignal Push]
        MAILERSEND[MailerSend Email]
    end

    WEB --> CORS
    CORS --> RATE
    RATE --> AUTH
    AUTH --> EXPRESS
    WEB <--> SOCKET

    EXPRESS --> AUTH_SVC
    EXPRESS --> USER_SVC
    EXPRESS --> DISASTER_SVC
    EXPRESS --> NGO_SVC
    EXPRESS --> AGENT_SVC
    EXPRESS --> NOTIFY_SVC
    EXPRESS --> PAYMENT_SVC
    EXPRESS --> QR_SVC
    EXPRESS --> WEATHER_SVC

    CRON --> WEATHER_SVC

    AUTH_SVC --> MONGO
    USER_SVC --> MONGO
    DISASTER_SVC --> MONGO
    NGO_SVC --> MONGO
    AGENT_SVC --> MONGO
    QR_SVC --> MONGO

    WEATHER_SVC --> GEE
    WEATHER_SVC --> FLOOD_API
    WEATHER_SVC --> WILDFIRE_API
    WEATHER_SVC --> DROUGHT_API
    WEATHER_SVC --> EARTHQUAKE_API

    DISASTER_SVC --> CLOUDINARY
    PAYMENT_SVC --> RAZORPAY
    NOTIFY_SVC --> ONESIGNAL
    AUTH_SVC --> MAILERSEND
```


### 3.2 Technology Stack Summary

#### Frontend Stack
| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | 19.1.0 | UI Component Library |
| Build Tool | Vite | 6.3.5 | Fast Development & Build |
| Styling | TailwindCSS | 4.x | Utility-First CSS |
| UI Components | HeroUI | Latest | Pre-built Components |
| State Management | Redux Toolkit | Latest | Global State |
| Persistence | Redux Persist | Latest | State Persistence |
| Routing | React Router DOM | 7.x | Client-side Routing |
| Forms | React Hook Form + Zod | Latest | Form Handling & Validation |
| Maps | Leaflet + React Leaflet | Latest | Interactive Maps |
| Geospatial | Turf.js | Latest | Geospatial Analysis |
| Animation | Framer Motion + GSAP | Latest | UI Animations |
| Web3 | RainbowKit + Wagmi + Viem | Latest | Blockchain Integration |
| Real-time | Socket.IO Client | Latest | WebSocket Communication |
| HTTP | Axios | Latest | API Requests |
| Notifications | OneSignal | Latest | Push Notifications |

#### Backend Stack
| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Runtime | Node.js | 18+ | JavaScript Runtime |
| Framework | Express | 5.1.0 | Web Framework |
| Database | MongoDB + Mongoose | 8.x | Data Persistence |
| Authentication | JWT + bcrypt | Latest | Token-based Auth |
| OAuth | Google Auth Library | Latest | Social Login |
| Security | Helmet + CORS | Latest | Security Headers |
| Rate Limiting | express-rate-limit | Latest | DDoS Protection |
| Real-time | Socket.IO | Latest | WebSocket Server |
| File Upload | Multer + Cloudinary | Latest | File Handling |
| Audio | FFmpeg | Latest | Audio Processing |
| Payments | Razorpay | Latest | Payment Gateway |
| Email | MailerSend | Latest | Transactional Email |
| Scheduling | node-cron | Latest | Background Jobs |
| AI/ML | Google Earth Engine | Latest | Satellite Data |
| Geospatial | H3-js | Latest | Hexagonal Indexing |


---

## 4. Frontend Architecture

### 4.1 Component Architecture

```mermaid
graph TB
    subgraph Entry Point
        MAIN[main.jsx]
    end

    subgraph Providers
        STRICT[StrictMode]
        REDUX[Redux Provider]
        PERSIST[PersistGate]
        ROUTER[BrowserRouter]
        HEROUI[HeroUIProvider]
        WALLET[WalletProvider]
        TOAST[ToastContainer]
    end

    subgraph App Structure
        APP[App.jsx]
        ROUTES[Router/index.jsx]
    end

    subgraph Layouts
        MAIN_LAYOUT[MainLayout]
        AUTH_LAYOUT[AuthLayout]
        DASHBOARD_LAYOUT[DashboardLayout]
    end

    subgraph Pages by Role
        ADMIN_PAGES[AdminPages]
        CITIZEN_PAGES[CitizenPages]
        NGO_PAGES[NGOPages]
        GOV_PAGES[Gov_AgencyPages]
        AUTH_PAGES[AuthPages]
        COMMON_PAGES[CommonPages]
    end

    subgraph Components by Role
        ADMIN_COMP[Admin Components]
        CITIZEN_COMP[Citizen Components]
        NGO_COMP[NGO Components]
        GOV_COMP[Gov_Agency Components]
        COMMON_COMP[Common_Features]
        UI_COMP[UI Components]
        HELPER_COMP[Helper Components]
    end

    MAIN --> STRICT
    STRICT --> REDUX
    REDUX --> PERSIST
    PERSIST --> ROUTER
    ROUTER --> HEROUI
    HEROUI --> WALLET
    WALLET --> APP
    WALLET --> TOAST

    APP --> ROUTES
    ROUTES --> MAIN_LAYOUT
    ROUTES --> AUTH_LAYOUT
    ROUTES --> DASHBOARD_LAYOUT

    MAIN_LAYOUT --> ADMIN_PAGES
    MAIN_LAYOUT --> CITIZEN_PAGES
    MAIN_LAYOUT --> NGO_PAGES
    MAIN_LAYOUT --> GOV_PAGES
    AUTH_LAYOUT --> AUTH_PAGES
    DASHBOARD_LAYOUT --> COMMON_PAGES

    ADMIN_PAGES --> ADMIN_COMP
    CITIZEN_PAGES --> CITIZEN_COMP
    NGO_PAGES --> NGO_COMP
    GOV_PAGES --> GOV_COMP
    COMMON_PAGES --> COMMON_COMP
    
    ADMIN_COMP --> UI_COMP
    CITIZEN_COMP --> UI_COMP
    NGO_COMP --> UI_COMP
    GOV_COMP --> UI_COMP
    COMMON_COMP --> UI_COMP
    UI_COMP --> HELPER_COMP
```


### 4.2 State Management Architecture

```mermaid
graph TB
    subgraph Redux Store
        STORE[configureStore]
        PERSIST_REDUCER[persistReducer]
        ROOT_REDUCER[rootReducer]
    end

    subgraph Slices
        AUTH_SLICE[authSlice]
        USER_SLICE[userSlice]
        DISASTER_SLICE[disasterSlice]
    end

    subgraph Auth State
        AUTH_STATE["role: string<br/>verified: boolean<br/>token: string<br/>ngo_verified: boolean<br/>agent_verified: boolean<br/>email: string<br/>NgoExist: boolean<br/>AgentExist: boolean"]
    end

    subgraph User State
        USER_STATE["_id: string<br/>firstName: string<br/>lastName: string<br/>role: string<br/>email: string<br/>phone: string<br/>profile: string<br/>help: boolean<br/>helpRequestLimit: number<br/>allocationConfirm: boolean<br/>feedback: boolean"]
    end

    subgraph Disaster State
        DISASTER_STATE["file1: string<br/>file2: string"]
    end

    STORE --> PERSIST_REDUCER
    PERSIST_REDUCER --> ROOT_REDUCER
    ROOT_REDUCER --> AUTH_SLICE
    ROOT_REDUCER --> USER_SLICE
    ROOT_REDUCER --> DISASTER_SLICE

    AUTH_SLICE --> AUTH_STATE
    USER_SLICE --> USER_STATE
    DISASTER_SLICE --> DISASTER_STATE
```

### 4.3 Auth Slice Actions

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| `register` | User registration | `POST /auth/register` |
| `verify` | Email OTP verification | `POST /auth/verifyEmail` |
| `login` | User login | `POST /auth/login` |
| `forgotPassword` | Password reset request | `POST /auth/forgetPassword` |
| `resetPassword` | Password reset | `POST /auth/resetPassword` |
| `logOut` | User logout | `GET /auth/logout` |
| `googleAuth` | Google OAuth login | `POST /auth/googleAuth` |
| `ngoEntry` | NGO registration | `POST /ngo/ngoEntry` |
| `agentEntry` | Agent registration | `POST /agent/agentEntry` |

### 4.4 User Slice Actions

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| `getUser` | Fetch user profile | `GET /user/getUser` |
| `editUser` | Update user details | `POST /user/{field}` |
| `editProfile` | Update profile picture | `POST /user/changeProfile` |
| `toggleHelp` | Toggle help status | `POST /user/changeHelp` |
| `deleteAccount` | Delete user account | `DELETE /user/removeAccount` |
| `submitFeedback` | Submit feedback | `POST /user/submitFeedback` |
| `agencyEmergencyStatus` | Toggle emergency mode | `POST /user/toggleEmergency` |

### 4.5 Disaster Slice Actions

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| `tempImage` | Upload temporary image | `POST /disasterReport/uploadTempImage{1,2}` |
| `deleteTempImage` | Delete temporary image | `POST /disasterReport/deleteTempImage{1,2}` |
| `disasterEnquiry` | Submit disaster report | `POST /disasterReport/{type}` |
| `predictedData` | Get AI predictions | `GET /weather/{type}` |
| `areaReport` | Submit area disaster report | `POST /disasterReport/areaEnquiry` |
| `sosRequest` | Send SOS alert | `POST /disasterReport/sosAlert` |
| `createQrCode` | Generate QR code | `POST /qrcode/create` |


### 4.6 Frontend Directory Structure

```
Client/src/
├── assets/                    # Static assets (images, videos, icons)
│   ├── images/
│   └── videos/
├── auth/                      # Authentication components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── components/
│   ├── Admin/                 # Admin-specific components
│   │   ├── Dashboard.jsx
│   │   ├── UserManagement.jsx
│   │   └── Analytics.jsx
│   ├── Citizen/               # Citizen-specific components
│   │   ├── DisasterReport.jsx
│   │   ├── HelpRequest.jsx
│   │   └── StatusTracker.jsx
│   ├── Common_Features/       # Shared components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Map.jsx
│   │   ├── WalletProvider.jsx
│   │   └── Footer.jsx
│   ├── Gov_Agency/            # Government agency components
│   │   ├── AgentDashboard.jsx
│   │   ├── VerificationPanel.jsx
│   │   └── ResourceAllocation.jsx
│   ├── Helper/                # Utility components
│   │   ├── Modal.jsx
│   │   ├── SearchBar.jsx
│   │   └── DateFormatter.jsx
│   ├── NGO/                   # NGO-specific components
│   │   ├── TaskManagement.jsx
│   │   ├── QRScanner.jsx
│   │   └── DistributionTracker.jsx
│   └── ui/                    # Base UI components (shadcn-style)
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Card.jsx
│       └── Dialog.jsx
├── ConnectContract/           # Web3/Blockchain integration
│   ├── ABIs/
│   └── ContractConnector.jsx
├── layouts/                   # Layout wrappers
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── lib/                       # Utility functions
│   └── utils.js
├── OneSignalSetup/            # Push notification config
│   └── OneSignalProvider.jsx
├── pages/                     # Page components
│   ├── AdminPages/
│   ├── AuthPages/
│   ├── CitizenPages/
│   ├── CommonPages/
│   ├── Gov_AgencyPages/
│   └── NGOPages/
├── routes/                    # React Router configuration
│   └── index.jsx
├── store/                     # Redux store
│   ├── slices/
│   │   ├── authSlice.jsx
│   │   ├── userSlice.jsx
│   │   └── disasterSlice.jsx
│   ├── index.js
│   └── rootReducer.js
├── utils/                     # Utilities
│   └── axios.js
├── App.jsx                    # Root component
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```


---

## 5. Backend Architecture

### 5.1 Express Application Structure

```mermaid
graph LR
    subgraph Request Pipeline
        REQ[Incoming Request]
        STATIC[Static Files]
        CORS_MW[CORS]
        COOKIE[Cookie Parser]
        BODY[Body Parser]
        HELMET_MW[Helmet Security]
        MORGAN[Morgan Logger]
        RATE_MW[Rate Limiter]
        ROUTES[Route Handler]
        RES[Response]
    end

    REQ --> STATIC
    STATIC --> CORS_MW
    CORS_MW --> COOKIE
    COOKIE --> BODY
    BODY --> HELMET_MW
    HELMET_MW --> MORGAN
    MORGAN --> RATE_MW
    RATE_MW --> ROUTES
    ROUTES --> RES
```

### 5.2 Middleware Configuration

```javascript
// Middleware Stack (Server/src/app.js)
app.use(express.static('public'))           // Static file serving
app.use(cors({                              // CORS configuration
    origin: process.env.FRONTEND_URL,
    methods: ["GET","PATCH","POST","DELETE","PUT"],
    credentials: true,
}))
app.use(cookieParser())                     // Cookie parsing
app.use(bodyParser.urlencoded({extended:true}))  // URL-encoded bodies
app.use(bodyParser.json())                  // JSON bodies
app.use(helmet({                            // Security headers
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(morgan('combined'))                 // Request logging
app.use(rateLimit({                         // Rate limiting
    windowMs: 60*60*1000,                   // 1 hour window
    limit: 100,                             // 100 requests per window
    message: 'Too many Requests from this IP'
}))
app.use(routes)                             // Route handlers
```

### 5.3 Route Architecture

```mermaid
graph TB
    subgraph API Routes
        INDEX[index.route.js]
    end

    subgraph Route Modules
        AUTH[/auth]
        USER[/user]
        ADMIN[/admin]
        NGO[/ngo]
        AGENT[/agent]
        DISASTER[/disasterReport]
        NOTIFY[/notify]
        DONATE[/donate]
        QRCODE[/qrcode]
        WEATHER[/weather]
    end

    subgraph Controllers
        AUTH_CTRL[auth.controller.js]
        USER_CTRL[user.controller.js]
        ADMIN_CTRL[admin.controller.js]
        NGO_CTRL[ngo.controller.js]
        AGENT_CTRL[agent.controller.js]
        DISASTER_CTRL[disasterReport.controller.js]
        NOTIFY_CTRL[notification.controller.js]
        RAZORPAY_CTRL[razorpay.controller.js]
        QR_CTRL[QrCode.controller.js]
        WEATHER_CTRL[weatherCheck.controller.js]
    end

    INDEX --> AUTH
    INDEX --> USER
    INDEX --> ADMIN
    INDEX --> NGO
    INDEX --> AGENT
    INDEX --> DISASTER
    INDEX --> NOTIFY
    INDEX --> DONATE
    INDEX --> QRCODE
    INDEX --> WEATHER

    AUTH --> AUTH_CTRL
    USER --> USER_CTRL
    ADMIN --> ADMIN_CTRL
    NGO --> NGO_CTRL
    AGENT --> AGENT_CTRL
    DISASTER --> DISASTER_CTRL
    NOTIFY --> NOTIFY_CTRL
    DONATE --> RAZORPAY_CTRL
    QRCODE --> QR_CTRL
    WEATHER --> WEATHER_CTRL
```


### 5.4 Backend Directory Structure

```
Server/src/
├── controllers/               # Route handlers
│   ├── admin.controller.js    # Admin operations
│   ├── agent.controller.js    # Government agent operations
│   ├── auth.controller.js     # Authentication logic
│   ├── disasterReport.controller.js  # Disaster reporting
│   ├── ngo.controller.js      # NGO operations
│   ├── notification.controller.js    # Push notifications
│   ├── QrCode.controller.js   # QR code generation
│   ├── razorpay.controller.js # Payment processing
│   ├── user.controller.js     # User management
│   └── weatherCheck.controller.js    # AI/ML predictions
├── db/                        # Database configuration
│   └── index.js               # MongoDB connection
├── Helper/                    # Business logic helpers
│   ├── audioConverter.js      # FFmpeg audio processing
│   ├── disasterAPIs.js        # ML prediction API calls
│   ├── fetchFloodReport.js    # Google Earth Engine integration
│   └── uploadCloudinary.js    # Cloudinary file uploads
├── middleware/                # Express middleware
│   ├── auth.middleware.js     # JWT verification
│   └── multer.middleware.js   # File upload handling
├── models/                    # Mongoose schemas
│   ├── agent.model.js         # Government agent schema
│   ├── areaDisaster.model.js  # Area disaster reports
│   ├── auth.model.js          # User authentication schema
│   ├── coordinates.model.js   # Geographic coordinates
│   ├── emergency.model.js     # Emergency requests
│   ├── feedback.model.js      # User feedback
│   ├── ngo.model.js           # NGO organization schema
│   ├── predictionData.model.js # AI prediction results
│   ├── qrcode.model.js        # QR code tokens
│   └── tokenBlackList.model.js # Revoked JWT tokens
├── routes/                    # API route definitions
│   ├── admin.route.js
│   ├── agent.route.js
│   ├── auth.route.js
│   ├── disasterReport.route.js
│   ├── index.route.js         # Route aggregator
│   ├── ngo.route.js
│   ├── notification.route.js
│   ├── qrCode.route.js
│   ├── razorpay.route.js
│   ├── user.route.js
│   └── weatherCheck.route.js
├── Templates/                 # Email templates
│   └── Mail/
│       └── resetPassword.js   # Password reset email
├── utils/                     # Utility functions
│   ├── catchAsync.js          # Async error wrapper
│   └── filterObj.js           # Object field filter
├── app.js                     # Express app configuration
└── index.js                   # Server entry point
```

### 5.5 Server Initialization Flow

```mermaid
sequenceDiagram
    participant ENV as dotenv
    participant APP as Express App
    participant HTTP as HTTP Server
    participant SOCKET as Socket.IO
    participant DB as MongoDB
    participant CRON as Cron Jobs

    ENV->>APP: Load environment variables
    APP->>HTTP: Create HTTP server
    HTTP->>SOCKET: Initialize Socket.IO
    SOCKET->>APP: Attach io instance
    APP->>DB: Connect to MongoDB
    DB-->>APP: Connection established
    APP->>HTTP: Start listening on port
    HTTP-->>APP: Server running
    APP->>CRON: Initialize weather check jobs
    CRON-->>APP: Jobs scheduled
```


---

## 6. Database Design

### 6.1 Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ NGO : "registers as"
    USER ||--o{ AGENT : "registers as"
    USER ||--o{ EMERGENCY : "creates"
    USER ||--o{ AREA_DISASTER : "reports"
    USER ||--o{ QR_CODE : "generates"
    USER ||--o{ FEEDBACK : "submits"
    
    NGO ||--o{ EMERGENCY : "responds to"
    AGENT ||--o{ EMERGENCY : "handles"
    
    COORDINATE ||--o{ PREDICTION_DATA : "generates"

    USER {
        ObjectId _id PK
        String firstName
        String lastName
        String email UK
        String password
        String googleId
        String role
        String phone
        Boolean verified
        String profile
        Boolean ngo_verified
        Boolean agent_verified
        Boolean ngoExist
        Boolean agentExist
        Number helpRequestLimit
        Number requestLimit
        Number urgencyLimit
        Boolean help
        Boolean feedback
        Boolean allocationConfirm
        String otp
        Date otp_expiry_time
        String passwordResetToken
        Date passwordResetExpires
        Date createdAt
        Date updatedAt
    }

    NGO {
        ObjectId _id PK
        ObjectId userId FK
        String ngo_Name
        String registrationNumber
        String registrationType
        String stateORcity
        String registeredAddress
        String officialEmail
        String phone
        String founderName
        String website
        String media_link
        String Official_docs
        Boolean status
        Boolean emergency
        Boolean is_verified
        Date createdAt
        Date updatedAt
    }

    AGENT {
        ObjectId _id PK
        ObjectId userId FK
        String name
        String email
        String official_id
        String department
        String badge_number
        String current_state
        String office_location
        Boolean status
        Boolean emergency
        Boolean is_verified
        Date createdAt
        Date updatedAt
    }

    EMERGENCY {
        ObjectId _id PK
        ObjectId requesterId FK
        ObjectId agentId FK
        ObjectId ngoId FK
        Date createdAt
        Date updatedAt
    }

    AREA_DISASTER {
        ObjectId _id PK
        ObjectId userId FK
        String disasterType
        Number riskLevel
        String severity
        Date createdAt
        Date updatedAt
    }

    COORDINATE {
        ObjectId _id PK
        Number lat
        Number lon
    }

    PREDICTION_DATA {
        ObjectId _id PK
        Number latitude
        Number longitude
        String disasterType
        Number riskLevel
        String severity
    }

    QR_CODE {
        ObjectId _id PK
        ObjectId userId FK
        Number id
        String qrCodeUrl
        String tokenHash
        Date createdAt
    }

    FEEDBACK {
        ObjectId _id PK
        String name
        String profile
        String disasterType
        String feedBack
        String organizationRole
        String organization
        Date createdAt
        Date updatedAt
    }

    TOKEN_BLACKLIST {
        ObjectId _id PK
        String token
        Date createdAt
    }
```


### 6.2 Schema Details

#### User Schema (auth.model.js)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | String | Yes | User's first name |
| `lastName` | String | No | User's last name |
| `email` | String | Yes | Unique email with validation |
| `password` | String | Conditional | Required if not using Google OAuth |
| `googleId` | String | Conditional | Required if using Google OAuth |
| `role` | Enum | Yes | `admin`, `citizen`, `ngo`, `gov_Agent` |
| `phone` | String | Conditional | Required for citizens without Google |
| `verified` | Boolean | No | Email verification status |
| `profile` | String | No | Profile picture URL |
| `ngo_verified` | Boolean | Conditional | NGO verification status |
| `agent_verified` | Boolean | Conditional | Agent verification status |
| `helpRequestLimit` | Number | No | Remaining help requests (default: 1) |
| `requestLimit` | Number | No | General request limit (default: 3) |
| `urgencyLimit` | Number | No | Urgency request limit (default: 1) |
| `otp` | String | No | Hashed OTP for verification |
| `otp_expiry_time` | Date | No | OTP expiration timestamp |
| `passwordResetToken` | String | No | Hashed password reset token |
| `passwordResetExpires` | Date | No | Reset token expiration |

#### NGO Schema (ngo.model.js)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | Yes | Reference to User |
| `ngo_Name` | String | Yes | Organization name |
| `registrationNumber` | String | Yes | Official registration number |
| `registrationType` | String | Yes | Type of registration |
| `stateORcity` | String | Yes | Operating location |
| `registeredAddress` | String | Yes | Official address |
| `officialEmail` | String | Yes | Organization email |
| `phone` | String | Yes | Contact number |
| `founderName` | String | Yes | Founder's name |
| `website` | String | Yes | Organization website |
| `media_link` | String | Yes | Social media link |
| `Official_docs` | String | Yes | Document URL (Cloudinary) |
| `status` | Boolean | No | Active status |
| `emergency` | Boolean | No | Emergency mode status |
| `is_verified` | Boolean | No | Admin verification status |

#### Agent Schema (agent.model.js)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | Yes | Reference to User |
| `name` | String | Yes | Agent's full name |
| `email` | String | Yes | Official email |
| `official_id` | String | Yes | Government ID |
| `department` | String | Yes | Department name |
| `badge_number` | String | Yes | Badge/Employee number |
| `current_state` | String | Yes | Current state of operation |
| `office_location` | String | Yes | Office address |
| `status` | Boolean | No | Active status |
| `emergency` | Boolean | No | Emergency mode status |
| `is_verified` | Boolean | No | Admin verification status |

#### Prediction Data Schema (predictionData.model.js)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `latitude` | Number | Yes | Geographic latitude |
| `longitude` | Number | Yes | Geographic longitude |
| `disasterType` | String | Yes | `Flood`, `Wildfire`, `Drought`, `Earthquake` |
| `riskLevel` | Number | Yes | Risk level (1: Low, 2: High) |
| `severity` | String | Yes | `Low` or `High` |

#### QR Code Schema (qrcode.model.js)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | Yes | Reference to User |
| `id` | Number | Yes | Unique QR identifier |
| `qrCodeUrl` | String | Yes | QR code image URL |
| `tokenHash` | String | Yes | Hashed verification token |
| `createdAt` | Date | Yes | Auto-expires after 2 days |


---

## 7. API Design

### 7.1 API Route Structure

| Route Prefix | Controller | Description |
|--------------|------------|-------------|
| `/auth` | auth.controller.js | Authentication & authorization |
| `/user` | user.controller.js | User profile management |
| `/admin` | admin.controller.js | Admin operations |
| `/ngo` | ngo.controller.js | NGO management |
| `/agent` | agent.controller.js | Government agent operations |
| `/disasterReport` | disasterReport.controller.js | Disaster reporting |
| `/notify` | notification.controller.js | Push notifications |
| `/donate` | razorpay.controller.js | Payment processing |
| `/qrcode` | QrCode.controller.js | QR code operations |
| `/weather` | weatherCheck.controller.js | AI/ML predictions |

### 7.2 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | User registration | No |
| `POST` | `/auth/verifyEmail` | OTP verification | No |
| `POST` | `/auth/login` | User login | No |
| `POST` | `/auth/forgetPassword` | Request password reset | No |
| `POST` | `/auth/resetPassword` | Reset password | No |
| `GET` | `/auth/logout` | User logout | Yes |
| `POST` | `/auth/googleAuth` | Google OAuth login | No |

### 7.3 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/user/getUser` | Get user profile | Yes |
| `POST` | `/user/changeProfile` | Update profile picture | Yes |
| `POST` | `/user/changeHelp` | Toggle help status | Yes |
| `DELETE` | `/user/removeAccount` | Delete account | Yes |
| `POST` | `/user/feedStatus` | Update feedback status | Yes |
| `POST` | `/user/submitFeedback` | Submit feedback | Yes |
| `GET` | `/user/getFeedbacks` | Get all feedbacks | Yes |
| `GET` | `/user/getUnverifiedNGO` | Get unverified NGO count | Yes (Admin) |
| `GET` | `/user/getUnverifiedAgent` | Get unverified agent count | Yes (Admin) |
| `POST` | `/user/toggleAgency` | Toggle agency status | Yes (Admin) |
| `POST` | `/user/toggleEmergency` | Toggle emergency mode | Yes |
| `POST` | `/user/defaultAllocationAndStatus` | Reset allocation | Yes |
| `POST` | `/user/resetAllocation` | Reset allocation only | Yes |

### 7.4 NGO Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/ngo/ngoEntry` | Register NGO | Yes |
| `GET` | `/ngo/getNgoDetails` | Get NGO details | Yes |
| `GET` | `/ngo/getAllNGO` | Get all NGOs | Yes |
| `POST` | `/ngo/ngoToggle` | Toggle NGO status | Yes |

### 7.5 Agent Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/agent/agentEntry` | Register agent | Yes |
| `GET` | `/agent/getAgentDetails` | Get agent details | Yes |
| `GET` | `/agent/getAllAgent` | Get all agents | Yes |
| `POST` | `/agent/agentToggle` | Toggle agent status | Yes |

### 7.6 Disaster Report Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/disasterReport/uploadTempImage1` | Upload first image | Yes |
| `POST` | `/disasterReport/uploadTempImage2` | Upload second image | Yes |
| `POST` | `/disasterReport/deleteTempImage1` | Delete first image | Yes |
| `POST` | `/disasterReport/deleteTempImage2` | Delete second image | Yes |
| `POST` | `/disasterReport/areaEnquiry` | Submit area report | Yes |
| `GET` | `/disasterReport/getAreaDisaster` | Get area disasters | Yes |
| `POST` | `/disasterReport/precaution` | Get precautions | Yes |
| `POST` | `/disasterReport/sosAlert` | Send SOS alert | Yes |
| `POST` | `/disasterReport/urgencyMail` | Send urgency mail | Yes |

### 7.7 Weather/Prediction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/weather/predictedData` | Get high-risk predictions | Yes |
| `GET` | `/weather/getAllPredictionData` | Get all predictions | Yes |

### 7.8 QR Code Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/qrcode/create` | Generate QR code | Yes |
| `POST` | `/qrcode/get` | Get QR code | Yes |
| `POST` | `/qrcode/delete` | Delete QR code | Yes |

### 7.9 Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/notify/segment` | Notify all subscribers | Yes |
| `POST` | `/notify/user` | Notify specific user | Yes |

### 7.10 Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/donate/create` | Create payment order | Yes |
| `POST` | `/donate/verify` | Verify payment | Yes |


---

## 8. Authentication & Authorization

### 8.1 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant DB as MongoDB
    participant Email as MailerSend

    Note over Client,Email: Registration Flow
    Client->>Server: POST /auth/register
    Server->>DB: Check existing user
    Server->>DB: Create/Update user
    Server->>Server: Generate OTP
    Server->>DB: Store hashed OTP
    Server->>Email: Send OTP email
    Server-->>Client: OTP sent successfully

    Note over Client,Email: OTP Verification
    Client->>Server: POST /auth/verifyEmail
    Server->>DB: Find user with valid OTP
    Server->>Server: Compare OTP hashes
    Server->>DB: Update verified status
    Server->>Server: Generate JWT token
    Server-->>Client: Set cookie + return token

    Note over Client,Email: Login Flow
    Client->>Server: POST /auth/login
    Server->>DB: Find user by email
    Server->>Server: Compare password hashes
    alt User not verified
        Server->>Server: Generate new OTP
        Server->>Email: Send OTP email
        Server-->>Client: Redirect to verify
    else User verified
        Server->>Server: Generate JWT token
        Server-->>Client: Set cookie + return token
    end
```

### 8.2 Google OAuth Flow

```mermaid
sequenceDiagram
    participant Client
    participant Google
    participant Server
    participant DB as MongoDB

    Client->>Google: Request OAuth consent
    Google-->>Client: Return ID token
    Client->>Server: POST /auth/googleAuth (idToken)
    Server->>Google: Verify ID token
    Google-->>Server: Return user payload
    Server->>DB: Find/Create user
    Server->>Server: Generate JWT token
    Server-->>Client: Set cookie + return token
```

### 8.3 JWT Token Structure

```javascript
// Token Generation
const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1y' }
);

// Cookie Configuration
const options = {
    httpOnly: true,      // Prevent XSS attacks
    secure: true,        // HTTPS only
    sameSite: "None",    // Cross-site requests
    maxAge: 360000 * 24 * 60 * 60 * 1000  // ~1 year
};
```

### 8.4 Password Security

```javascript
// Password Hashing (bcrypt with 12 rounds)
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 12);
}

// Password Comparison
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Password Reset Token (crypto)
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    return resetToken;
}
```

### 8.5 Role-Based Access Control

```mermaid
graph TB
    subgraph Roles
        ADMIN[Admin]
        CITIZEN[Citizen]
        NGO[NGO]
        AGENT[Gov Agent]
    end

    subgraph Permissions
        FULL[Full System Access]
        REPORT[Report Disasters]
        HELP[Request Help]
        MANAGE_RELIEF[Manage Relief]
        QR_TRACK[QR Tracking]
        VERIFY_ORG[Verify Organizations]
        ALLOCATE[Allocate Resources]
        EMERGENCY[Emergency Response]
    end

    ADMIN --> FULL
    ADMIN --> VERIFY_ORG
    ADMIN --> ALLOCATE

    CITIZEN --> REPORT
    CITIZEN --> HELP

    NGO --> MANAGE_RELIEF
    NGO --> QR_TRACK
    NGO --> EMERGENCY

    AGENT --> VERIFY_ORG
    AGENT --> ALLOCATE
    AGENT --> EMERGENCY
```

### 8.6 Token Blacklisting

```javascript
// Logout - Add token to blacklist
exports.logout = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await Blacklist.create({ token });
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
    return res.status(200).json({ message: "Logged out successfully" });
});
```


---

## 9. Real-Time Communication

### 9.1 Socket.IO Architecture

```mermaid
graph TB
    subgraph Client Side
        REACT[React App]
        SOCKET_CLIENT[Socket.IO Client]
    end

    subgraph Server Side
        HTTP[HTTP Server]
        SOCKET_SERVER[Socket.IO Server]
        EXPRESS[Express App]
    end

    subgraph Events
        CONNECT[connection]
        JOIN[join_donation]
        EMIT[emit to room]
        DISCONNECT[disconnect]
    end

    REACT --> SOCKET_CLIENT
    SOCKET_CLIENT <--> SOCKET_SERVER
    HTTP --> SOCKET_SERVER
    EXPRESS --> HTTP
    
    SOCKET_SERVER --> CONNECT
    SOCKET_SERVER --> JOIN
    SOCKET_SERVER --> EMIT
    SOCKET_SERVER --> DISCONNECT
```

### 9.2 Socket.IO Server Configuration

```javascript
// Server/src/index.js
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

// Attach to Express app for controller access
app.set("io", io);

// Connection handling
io.on("connection", (socket) => {
    console.log("Socket connected:", io.engine.clientsCount);

    // Join donation room for real-time updates
    socket.on("join_donation", (donationId) => {
        socket.join(donationId);
        console.log(`User joined room: ${donationId}`);
    });
});
```

### 9.3 Real-Time Use Cases

| Event | Description | Trigger |
|-------|-------------|---------|
| `connection` | New client connects | Client initialization |
| `join_donation` | Join donation tracking room | Donation page load |
| `donation_update` | Donation status change | Payment verification |
| `emergency_alert` | Emergency broadcast | SOS request |
| `resource_update` | Resource allocation change | Admin action |

### 9.4 Server Keep-Alive Mechanism

```javascript
// Prevent server sleep on free hosting
setInterval(() => {
    axios.get(url)
        .then(() => console.log('Stay awake'))
        .catch(err => console.error('Going down!', err));
}, 14 * 60 * 1000); // Every 14 minutes
```


---

## 10. AI/ML Integration

### 10.1 Disaster Prediction Architecture

```mermaid
graph TB
    subgraph Data Sources
        GEE[Google Earth Engine]
        CHIRPS[CHIRPS Rainfall Data]
        SRTM[SRTM Elevation Data]
        JRC[JRC Water Bodies]
    end

    subgraph ML APIs
        FLOOD_API[Flood Prediction API]
        WILDFIRE_API[Wildfire Prediction API]
        DROUGHT_API[Drought Prediction API]
        EARTHQUAKE_API[Earthquake Prediction API]
    end

    subgraph Processing
        CRON_WEATHER[Weather Cron Job<br/>Every 10 days]
        CRON_EARTHQUAKE[Earthquake Cron Job<br/>Every 2 days]
        DATA_PROCESSOR[Data Processor]
    end

    subgraph Storage
        COORDINATES[(Coordinates Collection)]
        PREDICTIONS[(Prediction Data Collection)]
    end

    GEE --> CHIRPS
    GEE --> SRTM
    GEE --> JRC

    CHIRPS --> DATA_PROCESSOR
    SRTM --> DATA_PROCESSOR
    JRC --> DATA_PROCESSOR

    COORDINATES --> CRON_WEATHER
    COORDINATES --> CRON_EARTHQUAKE

    CRON_WEATHER --> DATA_PROCESSOR
    DATA_PROCESSOR --> FLOOD_API
    DATA_PROCESSOR --> WILDFIRE_API
    DATA_PROCESSOR --> DROUGHT_API

    CRON_EARTHQUAKE --> EARTHQUAKE_API

    FLOOD_API --> PREDICTIONS
    WILDFIRE_API --> PREDICTIONS
    DROUGHT_API --> PREDICTIONS
    EARTHQUAKE_API --> PREDICTIONS
```

### 10.2 Google Earth Engine Integration

```javascript
// Server/src/Helper/fetchFloodReport.js

// Initialize Earth Engine with service account
function initEarthEngine() {
    return new Promise((resolve, reject) => {
        ee.data.authenticateViaPrivateKey(serviceAccount, () => {
            ee.initialize(null, null, resolve, reject);
        }, reject);
    });
}

// Data extraction functions
async function getDisasterData(lat, lng) {
    await initEarthEngine();
    const point = pointFromLatLng(lat, lng);
    
    const [rainfall, elevation, slope, waterDistance] = await Promise.all([
        getRainfall(point),      // CHIRPS dataset - 2 month sum
        getElevation(point),     // SRTM 30m resolution
        getSlope(point),         // Terrain analysis
        getWaterDistance(point)  // JRC water bodies
    ]);
    
    return {
        rainfall_mm: rainfall,
        elevation_m: elevation,
        slope_deg: slope,
        distance_to_water_m: waterDistance
    };
}
```

### 10.3 Earth Engine Data Sources

| Dataset | Source | Resolution | Data Type |
|---------|--------|------------|-----------|
| **CHIRPS** | `UCSB-CHG/CHIRPS/DAILY` | 5km | Daily precipitation |
| **SRTM** | `USGS/SRTMGL1_003` | 30m | Elevation & terrain |
| **JRC Water** | `JRC/GSW1_3/GlobalSurfaceWater` | 30m | Water body occurrence |

### 10.4 ML Prediction APIs

#### Flood Prediction
```javascript
// Predict flood occurrence
const predictFlood = async (payload) => {
    const response = await axios.post(
        `${process.env.FLOOD_API}/predict/happen`,
        payload
    );
    return response.data.prediction[0]; // 0: No flood, 1: Flood
};

// Predict flood damage severity
const predictFloodDamage = async (payload) => {
    const response = await axios.post(
        `${process.env.FLOOD_API}/predict/damage`,
        payload
    );
    return response.data.prediction[0]; // 1: Low, 2: High
};
```

#### Wildfire Prediction
```javascript
const predictWildFire = async (payload) => {
    // payload: { lat, lon, date }
    const response = await axios.post(
        `${process.env.WILDFIRE_API}/predict`,
        payload
    );
    return {
        occurrence: response.data.occurrence_class,  // 0 or 1
        severity: response.data.severity_class       // 1: Low, 2: High
    };
};
```

#### Drought Prediction
```javascript
const predictDrought = async (payload) => {
    // payload: { lat, lon, time (year) }
    const response = await axios.post(
        `${process.env.DROUGHT_API}/predict`,
        payload
    );
    return {
        occurrence: response.data.occurrence_class,
        severity: response.data.severity_class
    };
};
```

#### Earthquake Prediction
```javascript
const predictEarthquake = async (payload) => {
    // payload: { lat, lon, time (date) }
    const response = await axios.post(
        `${process.env.EARTHQUAKE_API}/predict`,
        payload
    );
    return {
        occurrence: response.data.occurrence_prediction.will_occur,
        severity: response.data.severity_prediction.severity_class
    };
};
```

### 10.5 Cron Job Schedules

| Job | Schedule | Description |
|-----|----------|-------------|
| **Weather Check** | `0 0 0 */10 * *` | Every 10 days at midnight |
| **Earthquake Check** | `0 0 0 */2 * *` | Every 2 days at midnight |

### 10.6 Prediction Data Flow

```mermaid
sequenceDiagram
    participant CRON as Cron Job
    participant DB as MongoDB
    participant GEE as Google Earth Engine
    participant ML as ML APIs

    CRON->>DB: Fetch all coordinates
    loop For each coordinate
        CRON->>GEE: Get disaster data (rainfall, elevation, slope, water distance)
        GEE-->>CRON: Return environmental data
        
        CRON->>ML: Predict flood occurrence
        ML-->>CRON: Return prediction
        
        alt Flood predicted
            CRON->>ML: Predict flood damage
            ML-->>CRON: Return severity
            CRON->>DB: Save prediction data
        end
        
        CRON->>ML: Predict wildfire
        ML-->>CRON: Return prediction
        
        alt Wildfire predicted
            CRON->>DB: Save prediction data
        end
        
        CRON->>ML: Predict drought
        ML-->>CRON: Return prediction
        
        alt Drought predicted
            CRON->>DB: Save prediction data
        end
    end
```


---

## 11. External Services Integration

### 11.1 Service Integration Overview

```mermaid
graph TB
    subgraph ReliefSync Backend
        SERVER[Express Server]
    end

    subgraph Authentication
        GOOGLE_OAUTH[Google OAuth 2.0]
        MAILERSEND[MailerSend API]
    end

    subgraph File Storage
        CLOUDINARY[Cloudinary CDN]
        MULTER[Multer Middleware]
    end

    subgraph Payments
        RAZORPAY[Razorpay Gateway]
    end

    subgraph Notifications
        ONESIGNAL[OneSignal Push]
    end

    subgraph AI/ML Services
        GEE[Google Earth Engine]
        ML_APIS[ML Prediction APIs]
    end

    SERVER --> GOOGLE_OAUTH
    SERVER --> MAILERSEND
    SERVER --> CLOUDINARY
    MULTER --> CLOUDINARY
    SERVER --> RAZORPAY
    SERVER --> ONESIGNAL
    SERVER --> GEE
    SERVER --> ML_APIS
```

### 11.2 Cloudinary Integration

| Feature | Description |
|---------|-------------|
| **Image Upload** | Disaster report images, profile pictures |
| **Document Storage** | NGO verification documents |
| **CDN Delivery** | Fast global content delivery |
| **Transformations** | Image optimization and resizing |

```javascript
// Upload configuration
const uploadToCloudinary = async (file) => {
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'reliefsync',
        resource_type: 'auto'
    });
    return result.secure_url;
};
```

### 11.3 Razorpay Integration

| Feature | Description |
|---------|-------------|
| **Order Creation** | Generate payment orders |
| **Payment Verification** | Verify payment signatures |
| **Webhook Support** | Real-time payment updates |

```javascript
// Payment flow
// 1. Create order
const order = await razorpay.orders.create({
    amount: amount * 100, // in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
});

// 2. Verify payment
const isValid = razorpay.validateWebhookSignature(
    body,
    signature,
    secret
);
```

### 11.4 OneSignal Push Notifications

| Feature | Description |
|---------|-------------|
| **Segment Notifications** | Broadcast to user groups |
| **Individual Notifications** | Target specific users |
| **Rich Notifications** | Images, actions, deep links |

### 11.5 MailerSend Email Service

| Template | Trigger | Content |
|----------|---------|---------|
| **OTP Verification** | Registration/Login | 6-digit OTP code |
| **Password Reset** | Forgot password | Reset link with token |
| **Emergency Alert** | SOS request | Urgency notification |

```javascript
// Email sending
await axios.post("https://api.mailersend.com/v1/email", {
    from: { email: `noreply@${process.env.EMAIL}`, name: 'ReliefSync' },
    to: [{ email: user.email }],
    subject: "Verification OTP",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`
}, {
    headers: {
        Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        "Content-Type": "application/json"
    }
});
```

### 11.6 Google OAuth Configuration

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google ID token
const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
});

const payload = ticket.getPayload();
const { given_name, email, sub, email_verified } = payload;
```


---

## 12. Security Architecture

### 12.1 Security Layers

```mermaid
graph TB
    subgraph Network Layer
        HTTPS[HTTPS/TLS]
        CORS_SEC[CORS Policy]
    end

    subgraph Application Layer
        HELMET_SEC[Helmet Headers]
        RATE_LIMIT[Rate Limiting]
        INPUT_VAL[Input Validation]
        SANITIZE[Data Sanitization]
    end

    subgraph Authentication Layer
        JWT_SEC[JWT Tokens]
        BCRYPT[bcrypt Hashing]
        OTP_SEC[OTP Verification]
        BLACKLIST[Token Blacklist]
    end

    subgraph Data Layer
        ENCRYPT[Data Encryption]
        MONGO_SEC[MongoDB Security]
    end

    HTTPS --> CORS_SEC
    CORS_SEC --> HELMET_SEC
    HELMET_SEC --> RATE_LIMIT
    RATE_LIMIT --> INPUT_VAL
    INPUT_VAL --> SANITIZE
    SANITIZE --> JWT_SEC
    JWT_SEC --> BCRYPT
    BCRYPT --> OTP_SEC
    OTP_SEC --> BLACKLIST
    BLACKLIST --> ENCRYPT
    ENCRYPT --> MONGO_SEC
```

### 12.2 Security Middleware Configuration

#### Helmet Security Headers
```javascript
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

| Header | Purpose |
|--------|---------|
| `X-Content-Type-Options` | Prevent MIME sniffing |
| `X-Frame-Options` | Prevent clickjacking |
| `X-XSS-Protection` | XSS attack prevention |
| `Strict-Transport-Security` | Force HTTPS |
| `Content-Security-Policy` | Control resource loading |

#### CORS Configuration
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL,  // Whitelist frontend
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true  // Allow cookies
}));
```

#### Rate Limiting
```javascript
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour window
    limit: 100,                 // 100 requests per window
    message: 'Too many Requests from this IP, Please try again in an hour'
});
```

### 12.3 Password Security

| Measure | Implementation |
|---------|----------------|
| **Hashing** | bcrypt with 12 salt rounds |
| **Storage** | Password field excluded from queries (`select: false`) |
| **Reset** | Crypto-generated tokens with 5-minute expiry |
| **OTP** | 6-digit numeric, hashed, 5-minute expiry |

### 12.4 Cookie Security

```javascript
const cookieOptions = {
    httpOnly: true,     // Prevent JavaScript access
    secure: true,       // HTTPS only
    sameSite: "None",   // Cross-site requests (for API)
    maxAge: 360000 * 24 * 60 * 60 * 1000  // Long expiry
};
```

### 12.5 Input Validation

| Layer | Validation |
|-------|------------|
| **Frontend** | Zod schema validation |
| **Backend** | Mongoose schema validators |
| **Email** | Regex pattern matching |
| **File Upload** | Multer file type/size limits |

### 12.6 Data Protection

| Data Type | Protection Method |
|-----------|-------------------|
| Passwords | bcrypt hashing (12 rounds) |
| OTPs | bcrypt hashing |
| Reset Tokens | SHA-256 hashing |
| JWT Tokens | HMAC-SHA256 signing |
| Sensitive Fields | `select: false` in schema |


---

## 13. Deployment Architecture

### 13.1 Deployment Overview

```mermaid
graph TB
    subgraph Client Deployment
        VERCEL[Vercel<br/>React Frontend]
    end

    subgraph Server Deployment
        RENDER[Render/Railway<br/>Node.js Backend]
    end

    subgraph Database
        MONGO_ATLAS[MongoDB Atlas<br/>Cloud Database]
    end

    subgraph CDN & Storage
        CLOUDINARY_CDN[Cloudinary<br/>Media Storage]
    end

    subgraph External Services
        GEE_CLOUD[Google Earth Engine]
        ML_CLOUD[ML API Services]
        RAZORPAY_CLOUD[Razorpay]
        ONESIGNAL_CLOUD[OneSignal]
        MAILERSEND_CLOUD[MailerSend]
    end

    VERCEL <--> RENDER
    RENDER <--> MONGO_ATLAS
    RENDER <--> CLOUDINARY_CDN
    RENDER --> GEE_CLOUD
    RENDER --> ML_CLOUD
    RENDER --> RAZORPAY_CLOUD
    RENDER --> ONESIGNAL_CLOUD
    RENDER --> MAILERSEND_CLOUD
```

### 13.2 Environment Configuration

#### Client Environment (.env)
```env
VITE_BASE_URL=https://api.reliefsync.com/
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_ONESIGNAL_APP_ID=your_onesignal_app_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### Server Environment (.env)
```env
# Server
PORT=5000
SERVER_URL=https://api.reliefsync.com
FRONTEND_URL=https://reliefsync.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/reliefsync

# Authentication
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id

# Email
EMAIL=reliefsync.com
MAILERSEND_API_KEY=your_mailersend_api_key

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payments
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# AI/ML APIs
FLOOD_API=https://flood-prediction-api.com
WILDFIRE_API=https://wildfire-prediction-api.com
DROUGHT_API=https://drought-prediction-api.com
EARTHQUAKE_API=https://earthquake-prediction-api.com

# Google Earth Engine
SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Notifications
ONESIGNAL_APP_ID=your_app_id
ONESIGNAL_API_KEY=your_api_key
```

### 13.3 Build & Deploy Commands

#### Frontend (Vercel)
```bash
# Build
npm run build

# Output: dist/
# Vercel auto-deploys from GitHub
```

#### Backend (Render/Railway)
```bash
# Start command
npm start

# Or with nodemon for development
npm run dev
```

### 13.4 CI/CD Pipeline

```mermaid
graph LR
    subgraph Development
        CODE[Code Changes]
        COMMIT[Git Commit]
        PUSH[Push to GitHub]
    end

    subgraph CI Pipeline
        LINT[ESLint Check]
        BUILD[Build Test]
    end

    subgraph CD Pipeline
        VERCEL_DEPLOY[Vercel Deploy<br/>Frontend]
        RENDER_DEPLOY[Render Deploy<br/>Backend]
    end

    subgraph Production
        PROD_FE[Production Frontend]
        PROD_BE[Production Backend]
    end

    CODE --> COMMIT
    COMMIT --> PUSH
    PUSH --> LINT
    LINT --> BUILD
    BUILD --> VERCEL_DEPLOY
    BUILD --> RENDER_DEPLOY
    VERCEL_DEPLOY --> PROD_FE
    RENDER_DEPLOY --> PROD_BE
```


---

## 14. Scalability & Performance

### 14.1 Scalability Strategies

```mermaid
graph TB
    subgraph Horizontal Scaling
        LB[Load Balancer]
        SERVER1[Server Instance 1]
        SERVER2[Server Instance 2]
        SERVER3[Server Instance N]
    end

    subgraph Database Scaling
        MONGO_PRIMARY[MongoDB Primary]
        MONGO_SECONDARY1[MongoDB Secondary 1]
        MONGO_SECONDARY2[MongoDB Secondary 2]
    end

    subgraph Caching Layer
        REDIS[Redis Cache]
    end

    subgraph CDN
        CDN_EDGE[CDN Edge Nodes]
    end

    LB --> SERVER1
    LB --> SERVER2
    LB --> SERVER3

    SERVER1 --> REDIS
    SERVER2 --> REDIS
    SERVER3 --> REDIS

    REDIS --> MONGO_PRIMARY
    MONGO_PRIMARY --> MONGO_SECONDARY1
    MONGO_PRIMARY --> MONGO_SECONDARY2

    CDN_EDGE --> LB
```

### 14.2 Performance Optimizations

| Layer | Optimization | Implementation |
|-------|--------------|----------------|
| **Frontend** | Code Splitting | Vite dynamic imports |
| **Frontend** | Asset Optimization | Vite build optimization |
| **Frontend** | State Persistence | Redux Persist |
| **Backend** | Connection Pooling | Mongoose connection pool |
| **Backend** | Async Processing | catchAsync wrapper |
| **Database** | Indexing | MongoDB indexes on frequently queried fields |
| **Database** | Cursor Streaming | Mongoose cursor for large datasets |
| **CDN** | Static Assets | Cloudinary CDN |
| **API** | Rate Limiting | 100 requests/hour per IP |

### 14.3 Database Optimization

```javascript
// Cursor-based iteration for large datasets
const cursor = Coordinate.find().cursor();
for await (const doc of cursor) {
    // Process each document without loading all into memory
}

// Indexed queries
userSchema.index({ email: 1 }, { unique: true });
predictionDataSchema.index({ latitude: 1, longitude: 1 });
```

### 14.4 Caching Strategy

| Data Type | Cache Duration | Strategy |
|-----------|----------------|----------|
| User Sessions | 1 year | JWT in cookies |
| Prediction Data | 10 days | Database refresh via cron |
| Static Assets | Long-term | CDN caching |
| API Responses | Short-term | Client-side caching |

### 14.5 Load Handling

| Scenario | Strategy |
|----------|----------|
| **Traffic Spike** | Rate limiting + horizontal scaling |
| **Database Load** | Read replicas + connection pooling |
| **File Uploads** | Direct to Cloudinary CDN |
| **Real-time Events** | Socket.IO rooms for targeted broadcasts |


---

## 15. Data Flow Diagrams

### 15.1 User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant EMAIL as MailerSend

    U->>FE: Fill registration form
    FE->>FE: Validate with Zod
    FE->>BE: POST /auth/register
    BE->>BE: Filter & validate input
    BE->>DB: Check existing user
    
    alt User exists & verified
        BE-->>FE: 409 User already exists
        FE-->>U: Show error toast
    else User exists & not verified
        BE->>DB: Update user data
        BE->>BE: Generate 6-digit OTP
        BE->>DB: Store hashed OTP
        BE->>EMAIL: Send OTP email
        BE-->>FE: 200 OTP sent
        FE-->>U: Redirect to verify page
    else New user
        BE->>DB: Create new user
        BE->>BE: Generate 6-digit OTP
        BE->>DB: Store hashed OTP
        BE->>EMAIL: Send OTP email
        BE-->>FE: 200 OTP sent
        FE-->>U: Redirect to verify page
    end
```

### 15.2 Disaster Prediction Flow

```mermaid
sequenceDiagram
    participant CRON as Cron Job
    participant DB as MongoDB
    participant GEE as Google Earth Engine
    participant FLOOD as Flood API
    participant FIRE as Wildfire API
    participant DROUGHT as Drought API

    Note over CRON: Runs every 10 days
    CRON->>DB: Fetch all coordinates
    
    loop For each coordinate
        CRON->>GEE: Initialize Earth Engine
        CRON->>GEE: Get rainfall (CHIRPS)
        CRON->>GEE: Get elevation (SRTM)
        CRON->>GEE: Get slope (Terrain)
        CRON->>GEE: Get water distance (JRC)
        GEE-->>CRON: Environmental data
        
        CRON->>FLOOD: Predict flood occurrence
        FLOOD-->>CRON: Prediction result
        
        alt Flood predicted
            CRON->>FLOOD: Predict damage severity
            FLOOD-->>CRON: Severity level
            CRON->>DB: Save flood prediction
        end
        
        CRON->>FIRE: Predict wildfire
        FIRE-->>CRON: Prediction result
        
        alt Wildfire predicted
            CRON->>DB: Save wildfire prediction
        end
        
        CRON->>DROUGHT: Predict drought
        DROUGHT-->>CRON: Prediction result
        
        alt Drought predicted
            CRON->>DB: Save drought prediction
        end
    end
```

### 15.3 Emergency Request Flow

```mermaid
sequenceDiagram
    participant C as Citizen
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant SOCKET as Socket.IO
    participant NGO as NGO Dashboard
    participant AGENT as Agent Dashboard

    C->>FE: Submit SOS request
    FE->>BE: POST /disasterReport/sosAlert
    BE->>DB: Create emergency record
    BE->>DB: Find available NGOs
    BE->>DB: Find available Agents
    BE->>SOCKET: Emit emergency_alert
    
    par Notify NGOs
        SOCKET-->>NGO: Emergency notification
    and Notify Agents
        SOCKET-->>AGENT: Emergency notification
    end
    
    BE-->>FE: 200 SOS sent
    FE-->>C: Show confirmation
    
    alt NGO responds
        NGO->>BE: Accept emergency
        BE->>DB: Update emergency (ngoId)
        BE->>SOCKET: Emit status_update
        SOCKET-->>C: NGO assigned notification
    end
    
    alt Agent responds
        AGENT->>BE: Accept emergency
        BE->>DB: Update emergency (agentId)
        BE->>SOCKET: Emit status_update
        SOCKET-->>C: Agent assigned notification
    end
```

### 15.4 QR Code Resource Tracking Flow

```mermaid
sequenceDiagram
    participant NGO as NGO User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant CITIZEN as Citizen

    Note over NGO: Resource Distribution
    NGO->>FE: Generate QR for resource
    FE->>BE: POST /qrcode/create
    BE->>BE: Generate unique token
    BE->>BE: Hash token
    BE->>BE: Generate QR image
    BE->>DB: Store QR record (expires 2 days)
    BE-->>FE: QR code URL
    FE-->>NGO: Display QR code
    
    Note over CITIZEN: Resource Verification
    CITIZEN->>FE: Scan QR code
    FE->>BE: POST /qrcode/get
    BE->>DB: Find QR by token
    
    alt Valid QR
        BE-->>FE: Resource details
        FE-->>CITIZEN: Show resource info
    else Expired/Invalid QR
        BE-->>FE: 404 Not found
        FE-->>CITIZEN: Show error
    end
```

### 15.5 Payment Donation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant RP as Razorpay
    participant DB as MongoDB
    participant SOCKET as Socket.IO

    U->>FE: Enter donation amount
    FE->>BE: POST /donate/create
    BE->>RP: Create order
    RP-->>BE: Order ID
    BE-->>FE: Order details
    
    FE->>RP: Open payment modal
    U->>RP: Complete payment
    RP-->>FE: Payment response
    
    FE->>BE: POST /donate/verify
    BE->>RP: Verify signature
    
    alt Valid payment
        BE->>DB: Record donation
        BE->>SOCKET: Emit donation_update
        BE-->>FE: 200 Success
        FE-->>U: Show success message
    else Invalid payment
        BE-->>FE: 400 Verification failed
        FE-->>U: Show error message
    end
```


---

## 16. Error Handling Strategy

### 16.1 Error Handling Architecture

```mermaid
graph TB
    subgraph Frontend Error Handling
        AXIOS_INT[Axios Interceptor]
        TOAST[Toast Notifications]
        ERROR_BOUNDARY[React Error Boundary]
    end

    subgraph Backend Error Handling
        CATCH_ASYNC[catchAsync Wrapper]
        VALIDATION[Mongoose Validation]
        HTTP_ERRORS[HTTP Error Responses]
    end

    subgraph Error Types
        AUTH_ERR[Authentication Errors]
        VAL_ERR[Validation Errors]
        DB_ERR[Database Errors]
        EXT_ERR[External Service Errors]
        SERVER_ERR[Server Errors]
    end

    AXIOS_INT --> TOAST
    ERROR_BOUNDARY --> TOAST

    CATCH_ASYNC --> HTTP_ERRORS
    VALIDATION --> HTTP_ERRORS

    AUTH_ERR --> HTTP_ERRORS
    VAL_ERR --> HTTP_ERRORS
    DB_ERR --> HTTP_ERRORS
    EXT_ERR --> HTTP_ERRORS
    SERVER_ERR --> HTTP_ERRORS
```

### 16.2 Backend Error Handling

#### catchAsync Wrapper
```javascript
// Server/src/utils/catchAsync.js
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Usage in controllers
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
});
```

#### HTTP Error Responses
| Status Code | Usage |
|-------------|-------|
| `200` | Success |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized / Invalid Credentials |
| `404` | Resource Not Found |
| `409` | Conflict (e.g., user already exists) |
| `500` | Internal Server Error |

### 16.3 Frontend Error Handling

#### Axios Interceptor
```javascript
// Client/src/utils/axios.js
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error.response?.data || error)
);
```

#### Toast Notifications
```javascript
// Error handling in Redux actions
try {
    const response = await axios.post('auth/login', formValues);
    toast.success(response.data.message);
} catch (error) {
    toast.error(error.message);
}
```

### 16.4 Validation Error Handling

#### Mongoose Schema Validation
```javascript
email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
        validator: function (email) {
            return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        },
        message: (props) => `Email (${props.value}) is invalid!`
    }
}
```

#### Input Filtering
```javascript
// Server/src/utils/filterObj.js
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

// Usage
const filteredBody = filterObj(req.body, "firstName", "lastName", "email");
```

### 16.5 External Service Error Handling

```javascript
// ML API error handling
const predictFlood = async (payload) => {
    try {
        const response = await axios.post(`${process.env.FLOOD_API}/predict`, payload);
        return response.data.prediction[0];
    } catch (error) {
        return {
            success: false,
            status: error.status,
            message: error.message
        };
    }
};
```


---

## 17. Monitoring & Logging

### 17.1 Logging Architecture

```mermaid
graph TB
    subgraph Request Logging
        MORGAN[Morgan Logger]
        COMBINED[Combined Format]
    end

    subgraph Application Logging
        CONSOLE[Console Logs]
        ERROR_LOG[Error Logging]
    end

    subgraph External Monitoring
        HEALTH[Health Checks]
        KEEP_ALIVE[Keep-Alive Pings]
    end

    MORGAN --> COMBINED
    CONSOLE --> ERROR_LOG
    HEALTH --> KEEP_ALIVE
```

### 17.2 Morgan Request Logging

```javascript
// Server/src/app.js
app.use(morgan('combined'));

// Combined format output:
// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" 
// :status :res[content-length] ":referrer" ":user-agent"
```

### 17.3 Application Logging

| Log Type | Usage | Example |
|----------|-------|---------|
| **Info** | General operations | `console.log('Server running on port', port)` |
| **Debug** | Development debugging | `console.log('OTP:', newOtp)` |
| **Error** | Error tracking | `console.error('Error:', error.message)` |
| **Socket** | Connection tracking | `console.log('Socket connected:', io.engine.clientsCount)` |

### 17.4 Health Monitoring

```javascript
// Server keep-alive ping
setInterval(() => {
    axios.get(url)
        .then(() => console.log('Stay awake'))
        .catch(err => console.error('Going down!', err));
}, 14 * 60 * 1000); // Every 14 minutes
```

### 17.5 Database Connection Monitoring

```javascript
// Server/src/db/index.js
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
```

### 17.6 Socket.IO Connection Monitoring

```javascript
io.on("connection", (socket) => {
    console.log("Socket connected:", io.engine.clientsCount);
    
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", io.engine.clientsCount);
    });
});
```

---

## 18. Appendix

### 18.1 Glossary

| Term | Definition |
|------|------------|
| **EARS** | Easy Approach to Requirements Syntax |
| **JWT** | JSON Web Token |
| **OTP** | One-Time Password |
| **CHIRPS** | Climate Hazards Group InfraRed Precipitation with Station data |
| **SRTM** | Shuttle Radar Topography Mission |
| **JRC** | Joint Research Centre (EU) |
| **CDN** | Content Delivery Network |
| **CORS** | Cross-Origin Resource Sharing |
| **XSS** | Cross-Site Scripting |
| **CSRF** | Cross-Site Request Forgery |

### 18.2 References

| Resource | URL |
|----------|-----|
| React Documentation | https://react.dev |
| Express.js Guide | https://expressjs.com |
| MongoDB Manual | https://docs.mongodb.com |
| Socket.IO Docs | https://socket.io/docs |
| Google Earth Engine | https://earthengine.google.com |
| Razorpay API | https://razorpay.com/docs |
| OneSignal Docs | https://documentation.onesignal.com |
| Cloudinary Docs | https://cloudinary.com/documentation |

### 18.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 2024 | Initial system design document |

---

<p align="center">
  <strong>🏗️ ReliefSync System Design Document</strong><br/>
  <em>Built with 💙 for Disaster Relief Management</em>
</p>
