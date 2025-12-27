# ReliefSync - Client Application

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.14-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.8.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)

A modern React-based frontend for the ReliefSync disaster relief management platform.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Architecture](#-architecture)

---

## 🎯 Overview

The ReliefSync Client is a comprehensive React application that provides role-based dashboards for Citizens, NGOs, Government Agencies, and Administrators to coordinate disaster relief efforts. It features real-time communication, interactive maps, blockchain integration, and push notifications.

---

## 🛠 Tech Stack

### Core Framework
| Technology | Version | Description |
|------------|---------|-------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | 19.1.0 | UI Library |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | 6.3.5 | Build Tool & Dev Server |

### Styling & UI
| Technology | Version | Description |
|------------|---------|-------------|
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | 4.1.14 | Utility-first CSS Framework |
| ![HeroUI](https://img.shields.io/badge/HeroUI-000000?style=flat&logo=heroui&logoColor=white) | 2.8.0-beta.6 | Component Library |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | 12.15.0 | Animation Library |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=black) | 3.13.0 | Advanced Animations |
| ![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=flat&logo=lucide&logoColor=white) | 0.511.0 | Icon Library |

### State Management
| Technology | Version | Description |
|------------|---------|-------------|
| ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white) | 2.8.2 | Global State Management |
| ![Redux Persist](https://img.shields.io/badge/Redux_Persist-764ABC?style=flat&logo=redux&logoColor=white) | 6.0.0 | State Persistence |
| ![React Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white) | 5.84.1 | Server State Management |

### Routing & Navigation
| Technology | Version | Description |
|------------|---------|-------------|
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white) | 7.6.0 | Client-side Routing |

### Maps & Geospatial
| Technology | Version | Description |
|------------|---------|-------------|
| ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white) | 1.9.4 | Interactive Maps |
| ![React Leaflet](https://img.shields.io/badge/React_Leaflet-199900?style=flat&logo=leaflet&logoColor=white) | 5.0.0 | React Leaflet Integration |
| ![Turf.js](https://img.shields.io/badge/Turf.js-3FB911?style=flat&logo=mapbox&logoColor=white) | 7.2.0 | Geospatial Analysis |

### Web3 & Blockchain
| Technology | Version | Description |
|------------|---------|-------------|
| ![RainbowKit](https://img.shields.io/badge/RainbowKit-7B3FE4?style=flat&logo=ethereum&logoColor=white) | 2.2.8 | Wallet Connection UI |
| ![Wagmi](https://img.shields.io/badge/Wagmi-000000?style=flat&logo=ethereum&logoColor=white) | 2.16.1 | React Hooks for Ethereum |
| ![Viem](https://img.shields.io/badge/Viem-1C1C1C?style=flat&logo=ethereum&logoColor=white) | 2.33.2 | TypeScript Ethereum Library |

### Forms & Validation
| Technology | Version | Description |
|------------|---------|-------------|
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white) | 7.56.4 | Form Management |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white) | 3.25.46 | Schema Validation |

### Real-time & Communication
| Technology | Version | Description |
|------------|---------|-------------|
| ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white) | 4.8.1 | Real-time Communication |
| ![OneSignal](https://img.shields.io/badge/OneSignal-E54B4D?style=flat&logo=onesignal&logoColor=white) | 3.2.3 | Push Notifications |
| ![React Toastify](https://img.shields.io/badge/React_Toastify-FFDD00?style=flat&logo=react&logoColor=black) | 11.0.5 | Toast Notifications |

### HTTP & Data
| Technology | Version | Description |
|------------|---------|-------------|
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | 1.13.2 | HTTP Client |
| ![JWT Decode](https://img.shields.io/badge/JWT_Decode-000000?style=flat&logo=jsonwebtokens&logoColor=white) | 4.0.0 | JWT Token Decoding |

### Additional Features
| Technology | Version | Description |
|------------|---------|-------------|
| ![HTML5 QRCode](https://img.shields.io/badge/HTML5_QRCode-000000?style=flat&logo=qrcode&logoColor=white) | 2.3.8 | QR Code Scanner |
| ![DOMPurify](https://img.shields.io/badge/DOMPurify-4A90E2?style=flat&logo=html5&logoColor=white) | 3.2.7 | XSS Sanitization |
| ![Spline](https://img.shields.io/badge/Spline-000000?style=flat&logo=spline&logoColor=white) | 4.1.0 | 3D Graphics |

---

## 📁 Project Structure

```
Client/
├── 📁 public/                          # Static public assets
│   ├── OneSignalSDKWorker.js          # OneSignal service worker
│   └── vite.svg                       # Vite logo
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 assets/                      # Static assets (images, videos)
│   │   ├── Android.mp4                # Android demo video
│   │   ├── Auth_back.png              # Authentication background
│   │   ├── desktop.mp4                # Desktop demo video
│   │   └── Logo.png                   # Application logo
│   │
│   ├── 📁 auth/                        # Authentication components
│   │   ├── EyeIcon.jsx                # Password visibility toggle
│   │   ├── ForgotPassword.jsx         # Password recovery
│   │   ├── GoogleAuth.jsx             # Google OAuth integration
│   │   ├── GOV_Verification.jsx       # Government agency verification
│   │   ├── Login.jsx                  # User login
│   │   ├── NGO_Verification.jsx       # NGO verification
│   │   ├── ResetPassword.jsx          # Password reset
│   │   ├── Signup.jsx                 # User registration
│   │   └── VerifyEmail.jsx            # Email verification
│   │
│   ├── 📁 components/                  # Reusable UI components
│   │   │
│   │   ├── 📁 Admin/                   # Admin-specific components
│   │   │   ├── ActiveAllocation.jsx   # Active resource allocation
│   │   │   ├── AgentCards.jsx         # Agent display cards
│   │   │   ├── AgentStatus.jsx        # Agent status overview
│   │   │   ├── AgentStatusCard.jsx    # Individual agent status
│   │   │   ├── AgentVerification.jsx  # Agent verification panel
│   │   │   ├── Home.jsx               # Admin dashboard home
│   │   │   ├── NgoCards.jsx           # NGO display cards
│   │   │   ├── NGOStatus.jsx          # NGO status overview
│   │   │   ├── NGOStatusCard.jsx      # Individual NGO status
│   │   │   └── NGOVerification.jsx    # NGO verification panel
│   │   │
│   │   ├── 📁 Citizen/                 # Citizen-specific components
│   │   │   ├── HelpDesk.jsx           # Help desk interface
│   │   │   ├── Home.jsx               # Citizen dashboard home
│   │   │   └── TodayArea.jsx          # Today's affected areas
│   │   │
│   │   ├── 📁 Common_Features/         # Shared components across roles
│   │   │   ├── AllocatedTask.jsx      # Task allocation display
│   │   │   ├── DeliveredTable.jsx     # Delivery tracking table
│   │   │   ├── DisasterReport.jsx     # Disaster reporting form
│   │   │   ├── EventTable.jsx         # Event listing table
│   │   │   ├── FeedBack.jsx           # Feedback collection
│   │   │   ├── FeedBackCard.jsx       # Feedback display card
│   │   │   ├── FilterRequest.jsx      # Request filtering
│   │   │   ├── Footer.jsx             # Application footer
│   │   │   ├── HelpRequest.jsx        # Help request form
│   │   │   ├── HomeSetup.jsx          # Home page setup
│   │   │   ├── LeftDrawer.jsx         # Left navigation drawer
│   │   │   ├── Map.jsx                # Interactive map component
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   ├── NoData.jsx             # Empty state component
│   │   │   ├── ScanQr.jsx             # QR code scanner
│   │   │   ├── Sidebar.jsx            # Sidebar navigation
│   │   │   ├── TargetAllocation.jsx   # Target allocation panel
│   │   │   ├── ToggleHelp.jsx         # Help toggle component
│   │   │   ├── UrgentVoiceMail.jsx    # Voice mail feature
│   │   │   ├── UserAvatar.jsx         # User avatar display
│   │   │   ├── UserProfile.jsx        # User profile component
│   │   │   ├── WalletConnect.jsx      # Web3 wallet connection
│   │   │   └── WalletProvider.jsx     # Wallet context provider
│   │   │
│   │   ├── 📁 Gov_Agency/              # Government agency components
│   │   │   ├── AgentWaitlist.jsx      # Agent waitlist management
│   │   │   └── Home.jsx               # Agency dashboard home
│   │   │
│   │   ├── 📁 Helper/                  # Utility & helper components
│   │   │   ├── CalculateDistance.jsx  # Distance calculation
│   │   │   ├── ConnectSocket.jsx      # Socket.IO connection
│   │   │   ├── CountryCenter.jsx      # Country center coordinates
│   │   │   ├── GeoLocation.jsx        # Geolocation utilities
│   │   │   ├── HeatMapLayer.jsx       # Map heat layer
│   │   │   ├── MapEffect.js           # Map visual effects
│   │   │   ├── MobileDragControl.jsx  # Mobile drag controls
│   │   │   ├── SearchBar.jsx          # Search functionality
│   │   │   ├── TextFormatter.jsx      # Text formatting utilities
│   │   │   │
│   │   │   └── 📁 Modals/              # Modal components
│   │   │       ├── DisasterRiskModal.jsx    # Disaster risk info
│   │   │       ├── FeedbackModel.jsx        # Feedback modal
│   │   │       ├── NotificationModal.jsx    # Notification modal
│   │   │       │
│   │   │       └── 📁 Finance/              # Finance modals
│   │   │           ├── CurrencyTransfer.jsx # Currency transfer
│   │   │           ├── DigitalTransfer.jsx  # Digital payment
│   │   │           └── PaymentModal.jsx     # Payment processing
│   │   │
│   │   ├── 📁 NGO/                     # NGO-specific components
│   │   │   ├── Home.jsx               # NGO dashboard home
│   │   │   ├── NgoWaitlist.jsx        # NGO waitlist
│   │   │   └── TodayTask.jsx          # Today's tasks
│   │   │
│   │   ├── 📁 ui/                      # Base UI components
│   │   │   ├── BoxEffect.jsx          # Box visual effects
│   │   │   ├── DraggableCard.jsx      # Draggable card component
│   │   │   ├── FooterEffect.jsx       # Footer animations
│   │   │   ├── form.jsx               # Form components
│   │   │   ├── input-otp.jsx          # OTP input component
│   │   │   ├── label.jsx              # Label component
│   │   │   ├── SmallCardEffect.jsx    # Small card animations
│   │   │   ├── TextHoverEffect.jsx    # Text hover effects
│   │   │   │
│   │   │   └── 📁 shadcn-io/           # Shadcn-style components
│   │   │       └── 📁 3d-marquee/
│   │   │           └── index.jsx      # 3D marquee effect
│   │   │
│   │   ├── AreaToday.jsx              # Today's area overview
│   │   ├── DisasterRiskOverview.jsx   # Disaster risk summary
│   │   ├── Disaster_DraggableCard.jsx # Draggable disaster card
│   │   ├── Disaster_small.jsx         # Small disaster display
│   │   └── Waitlist.jsx               # Waitlist component
│   │
│   ├── 📁 ConnectContract/             # Web3/Blockchain integration
│   │   ├── AidABI.json                # Aid contract ABI
│   │   ├── ConnectionAddress.js       # Contract addresses
│   │   ├── ForeCastABI.json           # Forecast contract ABI
│   │   └── Web3Connection.jsx         # Web3 connection handler
│   │
│   ├── 📁 layouts/                     # Layout components
│   │   └── [Layout files]             # Page layout wrappers
│   │
│   ├── 📁 lib/                         # Library utilities
│   │   └── utils.js                   # Utility functions (cn, etc.)
│   │
│   ├── 📁 OneSignalSetup/              # Push notification setup
│   │   └── OneSignalProvider.jsx      # OneSignal context provider
│   │
│   ├── 📁 pages/                       # Page components
│   │   │
│   │   ├── 📁 AdminPages/              # Admin pages
│   │   │   ├── ActiveAllocationPage.jsx
│   │   │   ├── AdminHomePage.jsx
│   │   │   ├── AgentStatusPage.jsx
│   │   │   ├── AgentVerificationPage.jsx
│   │   │   ├── NGOStatusPage.jsx
│   │   │   └── NGOVerificationPage.jsx
│   │   │
│   │   ├── 📁 AuthPages/               # Authentication pages
│   │   │   ├── AgentWaitlistPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── NgoWaitlistPage.jsx
│   │   │
│   │   ├── 📁 CitizenPages/            # Citizen pages
│   │   │   ├── CitizenHomePage.jsx
│   │   │   └── HelpDeskPage.jsx
│   │   │
│   │   ├── 📁 CommonPages/             # Shared pages
│   │   │   ├── AllocatedTaskPage.jsx
│   │   │   ├── DeliveredPage.jsx
│   │   │   ├── DisasterReportPage.jsx
│   │   │   ├── EventTablePage.jsx
│   │   │   ├── HelpRequestPage.jsx
│   │   │   ├── UrgentVoiceMailPage.jsx
│   │   │   └── UserProfilePage.jsx
│   │   │
│   │   ├── 📁 Gov_AgencyPages/         # Government agency pages
│   │   │   └── AgentHomePage.jsx
│   │   │
│   │   └── 📁 NGOPages/                # NGO pages
│   │       └── NGOHomePage.jsx
│   │
│   ├── 📁 routes/                      # React Router configuration
│   │   └── [Route definitions]        # Route setup files
│   │
│   ├── 📁 store/                       # Redux state management
│   │   ├── index.js                   # Store configuration
│   │   ├── rootReducer.js             # Root reducer
│   │   │
│   │   └── 📁 slices/                  # Redux slices
│   │       ├── authSlice.jsx          # Authentication state
│   │       ├── disasterSlice.jsx      # Disaster data state
│   │       └── userSlice.jsx          # User data state
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   └── axios.js                   # Axios instance config
│   │
│   ├── App.jsx                        # Root application component
│   ├── index.css                      # Global styles
│   ├── main.jsx                       # Application entry point
│   └── rainbowKitConfig.jsx           # RainbowKit configuration
│
├── .env                               # Environment variables
├── .gitignore                         # Git ignore rules
├── components.json                    # Shadcn components config
├── eslint.config.js                   # ESLint configuration
├── index.html                         # HTML entry point
├── jsconfig.json                      # JavaScript config
├── package.json                       # Dependencies & scripts
├── postcss.config.mjs                 # PostCSS configuration
├── tailwind.config.js                 # Tailwind configuration
├── vercel.json                        # Vercel deployment config
└── vite.config.js                     # Vite configuration
```

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Email verification with OTP
- Password recovery flow
- Google OAuth integration
- Role-based verification (NGO, Government Agency)

### 🗺️ Interactive Maps
- Real-time disaster location mapping
- Heat map visualization for affected areas
- Geolocation-based services
- Distance calculation utilities

### 💼 Role-Based Dashboards
- **Citizens**: Report disasters, request help, view affected areas
- **NGOs**: Manage relief operations, coordinate resources, track deliveries
- **Government Agencies**: Oversee operations, manage agents, verify organizations
- **Administrators**: System administration, user verification, resource allocation

### 🔔 Real-time Features
- Socket.IO for live updates
- Push notifications via OneSignal
- Toast notifications for user feedback
- Voice mail for urgent communications

### 💰 Web3 Integration
- Wallet connection via RainbowKit
- Blockchain-based resource tracking
- Digital payment integration
- Smart contract interaction

### 📱 QR Code Features
- QR code scanning for resource tracking
- Quick verification and check-ins

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**

### Installation

1. **Navigate to the Client directory**
   ```bash
   cd Client
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
   
   Create a `.env` file in the Client directory (or update the existing one):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_ONESIGNAL_APP_ID=your_onesignal_app_id
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173` (default Vite port)

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_SOCKET_URL` | Socket.IO server URL | Yes |
| `VITE_ONESIGNAL_APP_ID` | OneSignal App ID for push notifications | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional |
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect Project ID | Optional |

> **Note**: All client-side environment variables must be prefixed with `VITE_` to be accessible in the application.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🏗️ Architecture

### State Management Flow
```
┌─────────────────────────────────────────────────────────┐
│                    Redux Store                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ authSlice   │  │ userSlice   │  │disasterSlice│     │
│  │             │  │             │  │             │     │
│  │ - token     │  │ - profile   │  │ - reports   │     │
│  │ - user      │  │ - settings  │  │ - alerts    │     │
│  │ - role      │  │ - location  │  │ - areas     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Redux Persist                          │
│            (localStorage persistence)                   │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy
```
App.jsx
├── WalletProvider (Web3 Context)
│   └── OneSignalProvider (Push Notifications)
│       └── Router
│           ├── AuthPages (Login, Signup, etc.)
│           └── ProtectedRoutes
│               ├── AdminPages
│               ├── CitizenPages
│               ├── NGOPages
│               └── Gov_AgencyPages
```

### API Communication
```
Components ──► Axios Instance ──► Backend API
                    │
                    ├── Request Interceptors (Auth Token)
                    └── Response Interceptors (Error Handling)
```

---

## 📝 License

This project is part of the ReliefSync platform. See the root [LICENSE](../LICENSE) file for details.

---

<div align="center">

Made with 💙 for disaster relief coordination

</div>
