# KHOLFLIX - AI-Generated Streaming Platform

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS (port 5175)
- **Backend:** Node.js + Express (port 3002)
- **Database:** MySQL `kholflix` (XAMPP: localhost:3306, root, no password)

## Quick Start
```bash
# Database
/c/xampp/mysql/bin/mysql -u root < database/schema.sql
/c/xampp/mysql/bin/mysql -u root < database/seed.sql

# Backend
cd server && npm install && npm run dev   # http://localhost:3002

# Frontend
cd client && npm install && npm run dev   # http://localhost:5175
```

## Admin Access
- Email: admin@kholflix.com
- Password: admin123

## Project Structure
```
StreamingPlatform/
├── client/          # React frontend
│   └── src/
│       ├── api/           # Axios client
│       ├── context/       # AuthContext
│       ├── hooks/         # useAuth, useContent
│       ├── layouts/       # Main, Auth, Admin layouts
│       ├── components/    # common/, content/, search/, user/, admin/
│       └── pages/         # All pages + admin/
├── server/          # Express backend
│   └── src/
│       ├── config/db.js   # MySQL pool
│       ├── middleware/     # auth, admin, upload
│       ├── routes/        # auth, content, genres, search, user, playlists,
│       │                  # watchHistory, ratings, subscriptions, cast, admin
│       └── utils/helpers.js
├── database/
│   ├── schema.sql   # 16 tables
│   └── seed.sql     # Sample AI-generated content
└── research/        # Reference analysis
```

## Color Palette
- Background: #0a0a0f (dark), #13131a (lighter), #1e1e2e (card)
- Accent: violet-600 (#7c3aed) through violet-400 (#a78bfa)
- Gradient: violet-600 to indigo-600

## Database Tables (16)
users, content, genres, content_genres, seasons, episodes,
cast_members, content_cast, watchlist, favorites, playlists,
playlist_items, watch_history, ratings, subscription_plans, user_subscriptions

## API Routes
- `/api/auth` - register, login, me
- `/api/content` - list, featured, trending, latest, popular, detail, episodes, making-of, recommendations
- `/api/genres` - list, detail with content
- `/api/search` - global search
- `/api/user` - profile, watchlist, favorites
- `/api/playlists` - CRUD + items
- `/api/watch-history` - continue watching, progress tracking
- `/api/ratings` - rate & review
- `/api/subscriptions` - plans, subscribe
- `/api/cast` - member detail + filmography
- `/api/admin` - stats, content CRUD, genres CRUD, users, seasons, episodes, upload

## Key Features
- AI Badge component (color-coded per model: Sora=green, Runway=blue, Kling=orange)
- AI Making Of section on detail pages
- Hero banner with auto-rotation
- Content carousels with horizontal scroll
- Live search with autocomplete dropdown
- JWT auth with role-based access (user/admin)
- Video player supporting YouTube, Vimeo, local, external URLs
- Watchlist, Favorites, Playlists with DB persistence
- Admin panel with dashboard analytics + recharts
