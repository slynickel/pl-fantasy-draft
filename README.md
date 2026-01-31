# Fantasy Premier League Live Dashboard

A live status dashboard for your Fantasy Premier League draft league, built with Cloudflare Workers and Hono.

## Features

- 📊 Live standings and points tracking
- 🔄 Auto-refresh data every 5 minutes
- 📱 Fully responsive design
- ⚡ Powered by Cloudflare Workers (super fast)
- 🎨 Beautiful modern UI

## Setup

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update the league ID in the URL or set it in `wrangler.toml`:
```toml
[env.production]
vars = { LEAGUE_ID = "105341" }
```

### Development

Run the local development server:
```bash
npm run build
npm run dev
```

Visit `http://localhost:8787/105341` (replace 105341 with your league ID)

### Deployment

Deploy to Cloudflare:
```bash
npm run deploy
```

Your dashboard will be available at your Cloudflare Pages URL!

## League URL Format

Access your league dashboard at:
- `https://your-domain.pages.dev/{LEAGUE_ID}`
- Or set a default `LEAGUE_ID` environment variable

## API Endpoints

### Get Dashboard Data
```
GET /api/dashboard/{leagueId}
```

Returns:
```json
{
  "league": { ... },
  "standings": [ ... ],
  "last_updated": "2025-01-31T..."
}
```

## How It Works

1. Fetches league details from the FPL draft API
2. Queries each team's points for the current gameweek
3. Sorts teams by total points
4. Renders a beautiful HTML dashboard
5. Auto-refreshes every 5 minutes on the client

## Architecture

- **Hono**: Lightweight web framework
- **TypeScript**: Type-safe code
- **Cloudflare Workers**: Edge computing platform
- **CSS**: Responsive design with no dependencies

## Notes for Go Developers

If you're more comfortable with Go, here are the TypeScript/JavaScript equivalents:

- **Interfaces** → Go's interfaces (but more structural)
- **Types** → Go's type system
- **Promises** → Go's goroutines + channels
- **Async/Await** → Go's `go` keyword
- **Fetch API** → Go's `http.Get()`

## License

MIT
