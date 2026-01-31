const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_FOOTBALL_KEY;

app.get("/api/live-matches", async (req, res) => {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const data = await response.json();

    const matches = data.response.map((match) => ({
      league: match.league.name,
      home: match.teams.home.name,
      away: match.teams.away.name,
      score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
      minute: match.fixture.status.elapsed
        ? `${match.fixture.status.elapsed}'`
        : "0'",
    }));

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch live matches" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
