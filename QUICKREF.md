# 🚀 Quick Reference - Meetink Development

## Start Development
```bash
./dev.sh                    # Start both servers
```

## Manual Commands

### Frontend (Next.js)
```bash
cd frontend
npm install                 # Install dependencies
npm run dev                 # Start dev server (port 3000)
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Lint code
npm run type-check          # TypeScript check
```

### Backend (Python)
```bash
cd server
python -m venv venv         # Create virtual environment
source venv/bin/activate    # Activate (Linux/Mac)
# venv\Scripts\activate     # Activate (Windows)
pip install -r requirements.txt  # Install dependencies
python main.py              # Start server (port 8000)
```

## GraphQL Queries

### Fetch Confessions
```graphql
query {
  confessions {
    id content category likes gender
    anonymous_name avatar_seed created_at
    comments { id content gender }
  }
}
```

### Create Confession
```graphql
mutation {
  createConfession(
    content: "My confession"
    category: "General"
    gender: "male"
    anonymousName: "Anonymous Fox"
    avatarSeed: 12345
  ) { id content }
}
```

### Like Confession
```graphql
mutation {
  likeConfession(confessionId: "abc123")
}
```

### Add Comment
```graphql
mutation {
  createComment(
    confessionId: "abc123"
    content: "Nice!"
    gender: "female"
    anonymousName: "Anonymous Panda"
    avatarSeed: 67890
  ) { id }
}
```

## Environment Variables

### Frontend `.env.local`
```
GRAPHQL_URL=http://localhost:8000/graphql
```

### Backend `.env`
```
MONGO_URI=mongodb://localhost:27017/meetink
PORT=8000
```

## Project Structure
```
meetink/
├── frontend/          # Next.js app
│   ├── app/          # Pages (App Router)
│   ├── components/   # React components
│   └── lib/          # Utils & GraphQL client
└── server/           # Python GraphQL API
    ├── resolvers/    # Queries & mutations
    ├── models/       # Database models
    └── graphql_types/# GraphQL types
```

## Useful URLs
- Frontend: http://localhost:3000
- GraphQL API: http://localhost:8000/graphql
- Health Check: http://localhost:8000/health

## Common Tasks

### Add New GraphQL Query
1. Add method to `server/resolvers/queries.py`
2. Use in frontend: `graphqlRequest(query)`

### Add New Component
1. Create in `frontend/components/YourComponent.tsx`
2. Use TailwindCSS for styling
3. Import in page

### Database Operations
```python
# Create
await Confession(content="...").insert()

# Read
await Confession.find_all().to_list()
await Confession.get(id)

# Update
confession.likes += 1
await confession.save()

# Delete
await confession.delete()
```

## Troubleshooting

**Can't connect to GraphQL?**
→ Check `GRAPHQL_URL` in `.env.local`
→ Ensure Python server is running

**MongoDB errors?**
→ Verify `MONGO_URI` in `server/.env`
→ Start MongoDB: `mongod`

**Import errors in Python?**
→ Activate venv: `source venv/bin/activate`
→ Reinstall: `pip install -r requirements.txt`

**TypeScript errors?**
→ Run `npm run type-check`
→ Ensure types match GraphQL schema

## Tips
- Use GraphQL Playground for testing queries
- React Query DevTools auto-enabled in dev
- Check console for errors (Cmd+Option+J / F12)
- Hot reload enabled for both frontend & backend
