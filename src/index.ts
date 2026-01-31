import { Hono } from 'hono';
import { FPLClient } from './fpl-api';
import { renderHTML } from './render';

type Bindings = {
  LEAGUE_ID?: string;
};

const app = new Hono<{ Bindings: Bindings }>();
const fplClient = new FPLClient();

// API endpoint for dashboard data
app.get('/api/dashboard/:leagueId', async (c) => {
  try {
    const leagueId = parseInt(c.req.param('leagueId'));
    if (isNaN(leagueId)) {
      return c.json({ error: 'Invalid league ID' }, 400);
    }

    const dashboardData = await fplClient.getDashboardData(leagueId);
    return c.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return c.json({ error: 'Failed to fetch league data' }, 500);
  }
});

// HTML dashboard page
app.get('/:leagueId?', async (c) => {
  const leagueId = c.req.param('leagueId') || c.env.LEAGUE_ID || '105341';
  
  try {
    const dashboardData = await fplClient.getDashboardData(parseInt(leagueId));
    return c.html(renderHTML(dashboardData));
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    return c.html(renderHTML(null), 500);
  }
});

export default app;
