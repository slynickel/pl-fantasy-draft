import type { DashboardData } from './types';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    background: white;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    color: #333;
    font-size: 2.5em;
    margin-bottom: 10px;
  }

  .header p {
    color: #666;
    font-size: 1.1em;
  }

  .last-updated {
    color: #999;
    font-size: 0.9em;
    margin-top: 10px;
  }

  .standings-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #f0f0f0;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  tbody tr {
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .rank {
    font-weight: 700;
    color: #667eea;
    font-size: 1.2em;
    width: 40px;
  }

  .team-name {
    font-weight: 600;
    color: #333;
  }

  .manager-name {
    color: #666;
    font-size: 0.9em;
  }

  .points {
    text-align: right;
    font-weight: 600;
    color: #764ba2;
    min-width: 80px;
  }

  .event-points {
    text-align: right;
    color: #999;
    min-width: 80px;
  }

  .refresh-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95em;
    margin-top: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .refresh-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .refresh-btn:active {
    transform: translateY(0);
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: white;
    font-size: 1.2em;
  }

  .error {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .header {
      padding: 20px;
    }

    .header h1 {
      font-size: 1.8em;
    }

    th, td {
      padding: 12px 8px;
      font-size: 0.9em;
    }
  }
`;

export function renderHTML(data: DashboardData | null): string {
  if (!data) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Fantasy PL Dashboard</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="container">
            <div class="error">Error loading league data. Please try again later.</div>
          </div>
        </body>
      </html>
    `;
  }

  const standingsHtml = data.standings
    .map((entry, index) => `
      <tr>
        <td class="rank">#${index + 1}</td>
        <td>
          <div class="team-name">${entry.entry_name}</div>
          <div class="manager-name">${entry.player_first_name} ${entry.player_last_name}</div>
        </td>
        <td class="event-points">${entry.event_total || 0}pts</td>
        <td class="points"><strong>${entry.overall_points}</strong></td>
      </tr>
    `)
    .join('');

  const updatedAt = new Date(data.last_updated).toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${data.league.name} - Fantasy PL Dashboard</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚽ ${data.league.name}</h1>
            <p>Fantasy Premier League Draft League Standings</p>
            <div class="last-updated">Last updated: <span id="updated">${updatedAt}</span></div>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
          </div>

          <div class="standings-table">
            <table>
              <thead>
                <tr>
                  <th style="width: 60px;">Pos</th>
                  <th>Team</th>
                  <th style="width: 100px;">Gameweek</th>
                  <th style="width: 120px;">Total Points</th>
                </tr>
              </thead>
              <tbody>
                ${standingsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <script>
          // Auto-refresh every 5 minutes
          setInterval(() => {
            fetch(window.location.href)
              .then(r => r.text())
              .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                document.querySelector('tbody').innerHTML = newDoc.querySelector('tbody').innerHTML;
                document.getElementById('updated').textContent = new Date().toLocaleString();
              });
          }, 300000); // 5 minutes
        </script>
      </body>
    </html>
  `;
}
