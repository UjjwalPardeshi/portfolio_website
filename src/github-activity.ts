// ══════════════════════════════════════════════════════════════
// LIVE GITHUB ACTIVITY WIDGET
// ══════════════════════════════════════════════════════════════

const GITHUB_USERNAME = 'UjjwalPardeshi';



interface ContributionDay {
    date: string;
    count: number;
    level: number; // 0-4
}


// ── Fetch contribution data ───────────────────────────────────
async function fetchContributions(): Promise<ContributionDay[]> {
    try {
        const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        );
        if (!res.ok) throw new Error(`Contributions API error: ${res.status}`);
        const data = await res.json();
        return data.contributions || [];
    } catch (err) {
        console.warn('Failed to fetch GitHub contributions:', err);
        return [];
    }
}

// ── Render contribution grid ──────────────────────────────────
function renderContributionGrid(contributions: ContributionDay[]): void {
    const grid = document.getElementById('gh-contribution-grid');
    if (!grid || contributions.length === 0) return;

    // Take the last ~365 days
    const last365 = contributions.slice(-371);

    // Theme colors for contribution levels (Midnight Blue palette)
    const levelColors = [
        'rgba(25, 25, 112, 0.15)',  // level 0 – empty
        '#3F51B5',                   // level 1 – light
        '#3949AB',                   // level 2 – medium
        '#283593',                   // level 3 – heavy
        '#1A237E',                   // level 4 – most
    ];

    // Build weeks (columns of 7 days)
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Pad the start so the grid aligns by day-of-week
    const firstDay = new Date(last365[0]?.date || Date.now());
    const startPad = firstDay.getDay();
    for (let i = 0; i < startPad; i++) {
        currentWeek.push({ date: '', count: 0, level: -1 }); // invisible
    }

    last365.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Render
    grid.innerHTML = '';
    weeks.forEach((week) => {
        const col = document.createElement('div');
        col.className = 'gh-week';
        week.forEach((day) => {
            const cell = document.createElement('div');
            cell.className = 'gh-day';
            if (day.level === -1) {
                cell.style.visibility = 'hidden';
            } else {
                cell.style.backgroundColor = levelColors[day.level] || levelColors[0];
                cell.title = `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`;
            }
            col.appendChild(cell);
        });
        grid.appendChild(col);
    });

    // Calculate total contributions
    const totalContributions = last365.reduce((sum, d) => sum + d.count, 0);
    const totalEl = document.getElementById('gh-total-contributions');
    if (totalEl) {
        totalEl.textContent = totalContributions.toLocaleString();
    }
}

// ── Initialize ────────────────────────────────────────────────
export async function initGitHubActivity(): Promise<void> {
    // Show loading states
    const grid = document.getElementById('gh-contribution-grid');

    if (grid) grid.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; width: 100%">Loading contributions...</p>';

    // Fetch contributions
    const contributions = await fetchContributions();

    renderContributionGrid(contributions);
}
