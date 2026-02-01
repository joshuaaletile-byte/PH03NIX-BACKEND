const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("PH03NIX backend is running");
});

app.get("/api/live-matches", async (req, res) => {
  try {
    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY
        }
      }
    );

    const matches = response.data.response.map(match => ({
      league: match.league.name,
      home: match.teams.home.name,
      away: match.teams.away.name,
      score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
      minute: match.fixture.status.elapsed
        ? `${match.fixture.status.elapsed}'`
        : "0'"
    }));

    res.json(matches);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to fetch live matches" });
  }
});

app.listen(PORT, () => {
  console.log(`PH03NIX backend running on port ${PORT}`);
});
