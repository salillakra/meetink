# Meetink - Campus Connection Platform

A full-stack monorepo for anonymous confessions and campus networking, built with Next.js frontend and Python GraphQL backend.

## 🏗️ Architecture

This is a monorepo containing:
- **`frontend/`** - Next.js 14+ application (React, TypeScript, TailwindCSS)
- **`server/`** - Python FastAPI + Strawberry GraphQL server with MongoDB

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI + custom components
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI
- **GraphQL**: Strawberry GraphQL
- **Database**: MongoDB with Beanie ODM
- **Language**: Python 3.10+

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.10+
- **MongoDB** (local or Atlas)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd meetink

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Setup

#### Frontend `.env.local`
Create `frontend/.env.local`:

```env
# GraphQL server URL (Python backend)
GRAPHQL_URL=http://localhost:8000/graphql

# Database (if using Prisma for migrations only)
DATABASE_URL=mongodb://localhost:27017/meetink
```

#### Server `.env`
Create `server/.env`:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/meetink

# Or use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/meetink

# Server configuration
PORT=8000
HOST=0.0.0.0
```

### 3. Run Development Servers

#### Terminal 1 - Python GraphQL Server
```bash
cd server
source venv/bin/activate  # Activate virtual environment
python main.py
```

Server runs at `http://localhost:8000`  
GraphQL Playground: `http://localhost:8000/graphql`

#### Terminal 2 - Next.js Frontend
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:3000`

## 📁 Project Structure

```
meetink/
├── frontend/               # Next.js application
│   ├── app/               # App router pages
│   │   ├── confessions/   # Confessions page
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── ConfessionCard.tsx
│   │   ├── ConfessionForm.tsx
│   │   └── ...
│   ├── lib/              # Utilities
│   │   ├── graphql.ts    # GraphQL client
│   │   └── utils.ts      # Helper functions
│   └── prisma/           # Prisma schema (for DB migrations)
│
└── server/                # Python GraphQL backend
    ├── main.py           # FastAPI entry point
    ├── database/         # MongoDB connection
    ├── models/           # Beanie ODM models
    ├── graphql_types/    # Strawberry GraphQL types
    ├── resolvers/        # GraphQL queries & mutations
    │   ├── queries.py
    │   └── mutations.py
    └── schema/           # GraphQL schema
```

## 🔌 GraphQL API

### Available Queries

```graphql
# Get all confessions with comments
query {
  confessions {
    id
    content
    category
    likes
    gender
    anonymous_name
    avatar_seed
    created_at
    comments {
      id
      content
      gender
      anonymous_name
      avatar_seed
      created_at
    }
  }
}

# Get single confession
query {
  confession(confessionId: "abc123") {
    id
    content
    likes
  }
}
```

### Available Mutations

```graphql
# Create a confession
mutation {
  createConfession(
    content: "My confession text"
    category: "General"
    gender: "male"
    anonymousName: "Anonymous Panda"
    avatarSeed: 12345
  ) {
    id
    content
    likes
  }
}

# Like a confession
mutation {
  likeConfession(confessionId: "abc123")
}

# Add a comment
mutation {
  createComment(
    confessionId: "abc123"
    content: "Great confession!"
    gender: "female"
    anonymousName: "Anonymous Fox"
    avatarSeed: 67890
  ) {
    id
    content
  }
}

# Join early access
mutation {
  createEarlyAccess(
    email: "user@example.com"
    name: "John Doe"
  ) {
    id
    email
  }
}
```

## 🗄️ Database Schema

### Confession
```javascript
{
  _id: ObjectId,
  content: String,
  category: String?,
  likes: Number,
  isApproved: Boolean,
  gender: String,
  anonymousName: String,
  avatarSeed: Number,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Comment
```javascript
{
  _id: ObjectId,
  content: String,
  gender: String,
  anonymousName: String,
  avatarSeed: Number,
  confessionId: ObjectId,
  createdAt: DateTime
}
```

### EarlyAccess
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  createdAt: DateTime
}
```

## 🛠️ Development Commands

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Backend

```bash
# Run development server (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or simply
python main.py

# Format code
black .

# Type check
mypy .
```

## 🚢 Production Deployment

### Frontend (Vercel/Netlify)

1. Set environment variable:
   ```
   GRAPHQL_URL=https://your-backend-url.com/graphql
   ```

2. Deploy:
   ```bash
   npm run build
   ```

### Backend (Railway/Render/DigitalOcean)

1. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   PORT=8000
   ```

2. Use Dockerfile or direct Python deployment:
   ```bash
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

## 🔐 Environment Variables Reference

| Variable | Location | Description | Example |
|----------|----------|-------------|---------|
| `GRAPHQL_URL` | Frontend | Python GraphQL endpoint | `http://localhost:8000/graphql` |
| `MONGO_URI` | Server | MongoDB connection string | `mongodb://localhost:27017/meetink` |
| `PORT` | Server | Server port | `8000` |
| `DATABASE_URL` | Frontend | Prisma DB URL (optional) | `mongodb://localhost:27017/meetink` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Frontend can't connect to GraphQL server
- Ensure `GRAPHQL_URL` in `frontend/.env.local` points to running server
- Check CORS settings in `server/main.py`

### Database connection errors
- Verify MongoDB is running
- Check `MONGO_URI` in `server/.env`
- For Atlas, ensure IP is whitelisted

### Module not found errors
- Frontend: Run `npm install` in `frontend/`
- Backend: Activate venv and run `pip install -r requirements.txt`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Strawberry GraphQL](https://strawberry.rocks/)
- [MongoDB Beanie ODM](https://beanie-odm.dev/)
