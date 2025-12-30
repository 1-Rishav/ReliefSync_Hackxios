# ReliefSync - Project Structure

## Monorepo Layout
```
/
├── Client/          # React frontend application
├── Server/          # Node.js/Express backend API
├── README.md        # Project documentation
└── LICENSE
```

## Client Structure (Client/src/)
```
src/
├── assets/          # Static files (images, videos)
├── auth/            # Authentication components (Login, Signup, etc.)
├── components/
│   ├── Admin/       # Admin dashboard components
│   ├── Citizen/     # Citizen-specific components
│   ├── Common_Features/  # Shared components (Navbar, Sidebar, Map, etc.)
│   ├── Gov_Agency/  # Government agency components
│   ├── Helper/      # Utility components (modals, search, formatters)
│   ├── NGO/         # NGO-specific components
│   └── ui/          # Base UI components (shadcn-style)
├── ConnectContract/ # Web3/blockchain ABIs and connections
├── layouts/         # Layout wrapper components
├── lib/             # Utility functions (utils.js)
├── OneSignalSetup/  # Push notification configuration
├── pages/           # Page components organized by role
│   ├── AdminPages/
│   ├── AuthPages/
│   ├── CitizenPages/
│   ├── CommonPages/
│   ├── Gov_AgencyPages/
│   └── NGOPages/
├── routes/          # React Router configuration
├── store/           # Redux store
│   ├── slices/      # Redux slices (authSlice, userSlice, disasterSlice)
│   ├── index.js     # Store configuration
│   └── rootReducer.js
├── utils/           # Utilities (axios instance)
├── App.jsx          # Root component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Server Structure (Server/src/)
```
src/
├── controllers/     # Route handlers (auth, user, ngo, agent, etc.)
├── db/              # Database connection (MongoDB)
├── Helper/          # Business logic helpers (APIs, converters, uploads)
├── middleware/      # Express middleware (auth, multer)
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── Templates/       # Email templates
├── utils/           # Utilities (catchAsync, filterObj)
├── app.js           # Express app configuration
└── index.js         # Server entry point
```

## Naming Conventions
- Components: PascalCase (e.g., `UserProfile.jsx`)
- Pages: PascalCase with `Page` suffix (e.g., `AdminHomePage.jsx`)
- Controllers: camelCase with `.controller.js` suffix
- Models: camelCase with `.model.js` suffix
- Routes: camelCase with `.route.js` suffix
- Redux slices: camelCase with `Slice.jsx` suffix

## API Structure
- Base URL: `/api` (configured in Server/src/routes/index.route.js)
- Auth routes: `/api/auth/*`
- User routes: `/api/user/*`
- NGO routes: `/api/ngo/*`
- Agent routes: `/api/agent/*`
- Admin routes: `/api/admin/*`
- Disaster routes: `/api/disaster/*`

## Role-Based Organization
Components and pages are organized by user role:
- `Admin/` - Platform administration
- `Citizen/` - End-user disaster reporting and help requests
- `NGO/` - Relief organization task management
- `Gov_Agency/` - Government oversight and agent management
- `Common_Features/` - Shared across all roles
