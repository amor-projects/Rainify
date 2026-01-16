const BDC_API_ENDPOINT = "https://api-bdc.net/data/reverse-geocode";
const BDC_API_KEY = "bdc_eee7dc036a1b45d98accaf1f2a270fe9";

async function getLocation(coords) {
  const location = {ok: false, name: null};
  const {longitude, latitude} = coords;

  const BDC_API_URL = `${BDC_API_ENDPOINT}?latitude=${latitude}&longitude=${longitude}&key=${BDC_API_KEY}`;

  const response = await fetch(BDC_API_URL);

  if (response.ok) {
    const data = await response.json();
    location.ok = true;
    location.name = data.locality;
  }
  
  return location;
 
}

module.exports = { getLocation } ;