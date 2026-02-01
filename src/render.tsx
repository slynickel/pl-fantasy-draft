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
    max-width: 1000px;
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

  .matches-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
    margin-top: 24px;
    padding: 18px;
  }

  .matches-card h3 {
    margin-bottom: 6px;
    color: #333;
    font-size: 1.15em;
  }

  .matches-deadline {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 12px;
  }

  .matches-prev {
    background: rgba(245,245,245,0.98);
    border-left: 4px solid #b0b0b0;
  }

  .matches-prev h3 {
    color: #888;
  }

  .matches-prev .matches-deadline {
    color: #999;
  }

  .matches-prev thead {
    background: linear-gradient(135deg, #888888 0%, #707070 100%);
  }

  .matches-prev .team-name {
    color: #666;
  }

  .matches-prev .manager-name {
    color: #999;
  }

  .matches-prev .match-points {
    color: #888;
  }

  .matches-prev .match-status {
    color: #999;
  }

  .matches-next {
    background: rgba(255,255,255,0.98);
    border-left: 4px solid #c7f9cc;
  }

  .match-team {
    font-weight: 600;
    color: #333;
  }

  .match-points {
    text-align: center;
    color: #764ba2;
    font-weight: 700;
    width: 72px;
  }

  .match-status {
    color: #666;
    font-size: 0.9em;
    text-align: center;
    width: 100px;
  }

  .prev-week-winner {
    background-color: #DACBE6;
    color: #333;
  }

  .current-week-winner {
    background-color: #A2774B;
    font-weight: 900;
    color: white;
  }

  .current-week-leading {
    background-color: #C1AAD5;
    font-weight: 900;
    color: #333;
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

    .standings-table,
    .matches-card {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
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
          <link rel="icon" href="/favicon.ico">
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
    .map((entry, index) => {
      return `
      <tr>
        <td class="rank">#${index + 1}</td>
        <td>
          <div class="team-name">${entry.entry_name}</div>
          <div class="manager-name">${entry.player_first_name}</div>
        </td>
        <td style="text-align: center; font-size: 0.9em;">${entry.matches_won || 0}</td>
        <td style="text-align: center; font-size: 0.9em;">${entry.matches_drawn || 0}</td>
        <td style="text-align: center; font-size: 0.9em;">${entry.matches_lost || 0}</td>
        <td class="event-points" style="text-align: left;">${entry.overall_points ?? entry.tableTotal ?? 0} pts</td>
      </tr>
    `;
    })
    .join('');

  const updatedAtIso = data.last_updated;

  const entryMap = new Map((data.standings || []).map(s => [s.id, { name: s.entry_name, manager: s.player_first_name }]));
  const matchesObj = data.matches || {};
  const prevMatches = matchesObj.prev || [];
  const currentMatches = matchesObj.current || [];
  const nextMatches = matchesObj.next || [];

  const formatDeadline = (epochMs: number | undefined) => {
    if (!epochMs) return '';
    try {
      const d = new Date(epochMs * 1000);
      return d.toLocaleString();
    } catch (e) {
      return '';
    }
  };

  const renderMatchRows = (arr: any[], weekType: 'prev' | 'current' | 'next' = 'current') => arr.map(m => {
    const team1Points = m.league_entry_1_points ?? 0;
    const team2Points = m.league_entry_2_points ?? 0;
    const team1Won = team1Points > team2Points;
    const team2Won = team2Points > team1Points;
    
    let team1Class = '';
    let team2Class = '';
    
    if (weekType === 'prev' && m.finished) {
      // Previous week: emphasize the winner in gray theme
      if (team1Won) team1Class = 'prev-week-winner';
      if (team2Won) team2Class = 'prev-week-winner';
    } else if (weekType === 'current') {
      if (m.finished) {
        // Current week finished: emphasize winner in green
        if (team1Won) team1Class = 'current-week-winner';
        if (team2Won) team2Class = 'current-week-winner';
      } else if (m.started) {
        // Current week ongoing: highlight the team currently leading
        if (team1Won) team1Class = 'current-week-leading';
        if (team2Won) team2Class = 'current-week-leading';
      }
    }
    
    return `
      <tr>
        <td class="${team1Class}">
          <div class="team-name">${(entryMap.get(m.league_entry_1) && (entryMap.get(m.league_entry_1) as any).name) || m.league_entry_1}</div>
          <div class="manager-name">${(entryMap.get(m.league_entry_1) && (entryMap.get(m.league_entry_1) as any).manager) || ''}</div>
        </td>
        <td class="match-points ${team1Class}">${team1Points}</td>
        <td style="text-align:center; width: 40px;">vs</td>
        <td class="match-points ${team2Class}">${team2Points}</td>
        <td class="${team2Class}">
          <div class="team-name">${(entryMap.get(m.league_entry_2) && (entryMap.get(m.league_entry_2) as any).name) || m.league_entry_2}</div>
          <div class="manager-name">${(entryMap.get(m.league_entry_2) && (entryMap.get(m.league_entry_2) as any).manager) || ''}</div>
        </td>
        <td class="match-status">${m.finished ? 'Finished' : (m.started ? 'Live' : 'Scheduled')}</td>
      </tr>
    `;
  }).join('');

  const prevHtml = prevMatches.length ? `
    <div class="matches-card matches-prev">
      <h3>Previous Week${prevMatches[0] ? ' — Week ' + prevMatches[0].event : ''}</h3>
      ${prevMatches[0]?.eventInfo?.deadline_time_epoch ? `<div class="matches-deadline">Trade Deadline: <span data-epoch="${prevMatches[0].eventInfo.deadline_time_epoch * 1000}" class="deadline-time">${formatDeadline(prevMatches[0].eventInfo.deadline_time_epoch)}</span></div>` : ''}
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th style="width: 80px; text-align: center;">Pts</th>
            <th></th>
            <th style="width: 80px; text-align: center;">Pts</th>
            <th>Team</th>
            <th style="width: 120px;">Status</th>
          </tr>
        </thead>
        <tbody id="matches-prev-body">
          ${renderMatchRows(prevMatches, 'prev')}
        </tbody>
      </table>
    </div>
  ` : '';

  const currentHtml = currentMatches.length ? `
    <div class="matches-card">
      <h3>Matches${currentMatches[0] ? ' — Week ' + currentMatches[0].event : ''}</h3>
      ${currentMatches[0]?.eventInfo?.deadline_time_epoch ? `<div class="matches-deadline">Trade Deadline: <span data-epoch="${currentMatches[0].eventInfo.deadline_time_epoch * 1000}" class="deadline-time">${formatDeadline(currentMatches[0].eventInfo.deadline_time_epoch)}</span></div>` : ''}
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th style="width: 80px; text-align: center;">Pts</th>
            <th></th>
            <th style="width: 80px; text-align: center;">Pts</th>
            <th>Team</th>
            <th style="width: 120px;">Status</th>
          </tr>
        </thead>
        <tbody id="matches-current-body">
          ${renderMatchRows(currentMatches, 'current')}
        </tbody>
      </table>
    </div>
  ` : '';

  const nextHtml = nextMatches.length ? `
    <div class="matches-card matches-next">
      <h3>Next Week${nextMatches[0] ? ' — Week ' + nextMatches[0].event : ''}</h3>
      ${nextMatches[0]?.eventInfo?.deadline_time_epoch ? `<div class="matches-deadline">Trade Deadline: <span data-epoch="${nextMatches[0].eventInfo.deadline_time_epoch * 1000}" class="deadline-time">${formatDeadline(nextMatches[0].eventInfo.deadline_time_epoch)}</span></div>` : ''}
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th style="width: 80px; text-align: center;">Pts</th>
            <th></th>
            <th style="width: 80px; text-align: center;">Pts</th>
            <th>Team</th>
            <th style="width: 120px;">Status</th>
          </tr>
        </thead>
        <tbody id="matches-next-body">
          ${renderMatchRows(nextMatches, 'next')}
        </tbody>
      </table>
    </div>
  ` : '';

  const matchesSection = `${prevHtml}${currentHtml}${nextHtml}`;

  return `
    <!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${data.league.name} - Fantasy PL Dashboard</title>
        <link rel="icon" href="/favicon.ico">
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚽ ${data.league.name}</h1>
            <p>Fantasy Premier League Draft League Standings</p>
            <div class="last-updated">Last updated: <span id="updated" data-iso="${updatedAtIso}">${updatedAtIso}</span></div>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
          </div>

          <div class="standings-table">
            <table>
              <thead>
                <tr>
                  <th style="width:50px">Pos</th>
                  <th>Team</th>
                  <th style="text-align: center; width:40px">W</th>
                  <th style="text-align: center; width:40px">D</th>
                  <th style="text-align: center; width:40px">L</th>
                  <th style="text-align: left; width:120px">Points</th>
                </tr>
              </thead>
              <tbody id="standings-body">
                ${standingsHtml}
              </tbody>
            </table>
          </div>

          ${matchesSection}

          <footer style="margin-top:20px; text-align:center; color:#eee; font-size:0.9em;">
            <a href="https://github.com/slynickel/pl-fantasy-draft" target="_blank" rel="noopener" style="color:#fff; text-decoration:underline;">Source on GitHub</a>
          </footer>

        </div>

        <script>
          // Format deadline and last-updated times in browser local timezone with day of week
          function formatDeadlineTime(el) {
            if (!el) return;
            const epochMs = el.getAttribute('data-epoch');
            if (!epochMs) return;
            try {
              const d = new Date(parseInt(epochMs));
              if (!isNaN(d.valueOf())) {
                el.textContent = d.toLocaleString('default', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                });
              }
            } catch (e) {}
          }

          function formatUpdated(el) {
            if (!el) return;
            const iso = el.getAttribute('data-iso') || el.textContent;
            try {
              const d = new Date(iso);
              if (!isNaN(d.valueOf())) {
                el.textContent = d.toLocaleString('default', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
              }
            } catch (e) {}
          }

          // Format all deadline times on initial load
          document.querySelectorAll('.deadline-time').forEach(el => formatDeadlineTime(el));

          // initial format
          formatUpdated(document.getElementById('updated'));

          // Auto-refresh every 5 minutes and update standings/matches/updated
          setInterval(() => {
            fetch(window.location.href)
              .then(r => r.text())
              .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                const newStandings = newDoc.getElementById('standings-body');
                const newPrev = newDoc.getElementById('matches-prev-body');
                const newCurrent = newDoc.getElementById('matches-current-body');
                const newNext = newDoc.getElementById('matches-next-body');
                const newUpdated = newDoc.getElementById('updated');
                if (newStandings) {
                  const el = document.getElementById('standings-body');
                  if (el) el.innerHTML = newStandings.innerHTML;
                }
                if (newPrev) {
                  const elm = document.getElementById('matches-prev-body');
                  if (elm) elm.innerHTML = newPrev.innerHTML;
                }
                if (newCurrent) {
                  const elm = document.getElementById('matches-current-body');
                  if (elm) elm.innerHTML = newCurrent.innerHTML;
                }
                if (newNext) {
                  const elm = document.getElementById('matches-next-body');
                  if (elm) elm.innerHTML = newNext.innerHTML;
                }
                // Format deadline times after refresh
                document.querySelectorAll('.deadline-time').forEach(el => formatDeadlineTime(el));
                if (newUpdated) {
                  const target = document.getElementById('updated');
                  if (target) {
                    const iso = newUpdated.getAttribute('data-iso') || newUpdated.textContent;
                    target.setAttribute('data-iso', iso || '');
                    formatUpdated(target);
                  }
                }
              });
          }, 300000); // 5 minutes
        </script>
      </body>
    </html>
  `;
}
