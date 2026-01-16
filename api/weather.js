const {getLocation} = require('./location.js');
const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');


const API_ENDPOINT = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const API_KEY = "3WLSG8VHF6EQ2LXDE6EPYTL7E";
let location = "Multan";

app.get('/fetch_weather', async (req, res) => {
  location = req.query.location;
  const API_URL = `${API_ENDPOINT}${location}?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API returned Status: ${res.status}`);
    }
    const data = await response.json();
    res.json({
      success: true,
      message: `Data for ${location} fetched successfully`,
      data: data
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error Fetching Data",
      error: error.message
    })
  }
});

app.get('/get_locality', async (req, res) => {
  const coords = {};
  if (req.query.latitude && req.query.longitude) {
    coords = {longitude: req.query.longitude, latitude: req.query.latitude};
  } else {
    throw new Error ("Can't get location based on coordinates");
  }
  try {
    const location = await getLocation(coords);
    if (location.ok) {
      res.json({
        location: location.name
      })
    } else {
      res.json({
        location: null
      })
    }
  }
  catch (error) {
    console.log(error);
    res.json({
      location: null
    })
  }
})
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
