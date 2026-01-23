const { getLocation } = require('./location.js');
const express = require('express');
const path = require('path');
const app = express();

const API_ENDPOINT = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// IMPORTANT: Do not hardcode keys. Use Vercel Environment Variables.
const API_KEY = process.env.WEATHER_API_KEY; 

app.get('/api/fetch_weather', async (req, res) => {
  const location = req.query.location || "Multan";
  const API_URL = `${API_ENDPOINT}${location}?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API returned Status: ${response.status}`);
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/get_locality', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const locationData = await getLocation({ latitude, longitude });
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ message: 'API failure', error: error.message });
  }
});

module.exports = app;