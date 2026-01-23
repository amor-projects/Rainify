const BDC_API_ENDPOINT = "https://api-bdc.net/data/reverse-geocode";
const BDC_API_KEY = process.env.BDC_API_KEY;

async function getLocation(coords) {
  const location = {ok: false, name: null, countryName: null};
  const longitude = coords.longitude;
  const latitude = coords.latitude;
  const BDC_API_URL = `${BDC_API_ENDPOINT}?longitude=${longitude}&latitude=${latitude}&key=${BDC_API_KEY}`;
  const response = await fetch(BDC_API_URL);

  if (response.ok) {
    const data = await response.json();
    location.ok = true;
    location.city = data.city;
    location.locality = data.locality;
    location.countryName = data.countryName;
  }
  
  return location;
 
}

module.exports = { getLocation } ;