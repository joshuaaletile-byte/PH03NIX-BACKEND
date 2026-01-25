const express = require('express');
const fetch = require('node-fetch'); // install node-fetch if needed
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

// Replace with your API key from api-football.com
const API_KEY = 'YOUR_API_KEY';

app.get('/api/live-matches', async (req, res) => {
  try {
    const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: {
        'x-apisports-key': API_KEY
      }
    });
    const data = await response.json();
    
    // Simplify data for frontend
    const matches = data.response.map(match => ({
      league: match.league.name,
      home: match.teams.home.name,
      away: match.teams.away.name,
      score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
      minute: match.fixture.status.elapsed ? `${match.fixture.status.elapsed}'` : '0\''
    }));

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
