# NCSKIT Website

Research Operating System for Economics & Data Analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Vercel Postgres recommended)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Sacvui/NCSKIT_home.git
cd NCSKIT_home
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
- `POSTGRES_URL`: Your Vercel Postgres connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your deployment URL

4. Push database schema
```bash
npm run db:push
```

5. Run development server
```bash
npm run dev
```

Visit [http://localhost:9090](http://localhost:9090)

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables Required on Vercel

```
POSTGRES_URL=your_vercel_postgres_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://ncskit.org
```

### Optional OAuth Setup

For social login, add these to Vercel:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
ORCID_CLIENT_ID=...
ORCID_CLIENT_SECRET=...
```

## 🔑 Default Login Credentials

- **Root Admin**: `hailp` / `123456`
- **Demo User**: `demo@ncskit.org` / `demo123`

## 📝 Scripts

- `npm run dev` - Start development server (port 9090)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:generate` - Generate migrations

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Auth**: NextAuth.js
- **Database**: PostgreSQL (Drizzle ORM)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Deployment**: Vercel

## 📄 License

MIT License - see LICENSE file for details
