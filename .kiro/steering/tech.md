# ReliefSync - Tech Stack

## Frontend (Client/)
- **Framework**: React 19.1.0 with Vite 6.3.5
- **Styling**: TailwindCSS 4.x, HeroUI, Framer Motion, GSAP
- **State**: Redux Toolkit + Redux Persist, TanStack Query
- **Routing**: React Router DOM 7.x
- **Forms**: React Hook Form + Zod validation
- **Maps**: Leaflet + React Leaflet, Turf.js for geospatial
- **Web3**: RainbowKit, Wagmi, Viem
- **Real-time**: Socket.IO Client, OneSignal
- **HTTP**: Axios

## Backend (Server/)
- **Runtime**: Node.js 18+
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.x
- **Auth**: JWT (jsonwebtoken), bcrypt, Google OAuth
- **Security**: Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Real-time**: Socket.IO
- **AI/ML**: OpenAI SDK, Google Earth Engine
- **Files**: Cloudinary, Multer, FFmpeg
- **Payments**: Razorpay
- **Geo**: H3-js for hexagonal indexing

## Common Commands

### Client
```bash
cd Client
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Server
```bash
cd Server
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production server (localhost:5000)
```

## Environment Variables
- Client: `.env` with `VITE_` prefixed variables
- Server: `.env` with database, API keys, secrets

## Code Style
- ESLint with React Hooks plugin
- JSX files use `.jsx` extension
- ES Modules in frontend, CommonJS in backend
- Async/await pattern with catchAsync wrapper (server)
