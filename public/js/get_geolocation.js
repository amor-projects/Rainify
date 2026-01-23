import {currentLocation} from './utils.js';

const successLocation = async (position) => {
  const coords = position.coords;
  console.log (position.coords);
  try {
    if (coords && coords.longitude && coords.latitude) {
      const LOCALITY_URL = `/api/get_locality?longitude=${coords.longitude}&latitude=${coords.latitude}`;
      const response = await fetch(LOCALITY_URL);
      if (!response.ok) {
        throw new Error (`Unable to get Location from ${coords}`);
      } else {
        const data = await response.json();
        currentLocation.locality = data.locality;
      }
    } else {
      throw new Error("Invalid Coordinates Object!");
    }
  } catch (error) {
    console.error (error);
    console.error (`Unable to Get Location due to ${error.message} falling back to default location`);
    currentLocation.locality = 'Multan';
    currentLocation.countryName = 'Pakistan';
  }
  return currentLocation
}

const failureLocation = (error) => {
  console.error(`Failed to get Location due to ${error.message}`)
  console.log("Falling back to default Location");
  currentLocation.locality = 'Multan';
  currentLocation.countryName = 'Pakistan';
  return currentLocation;
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function getGeoLocation () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successLocation, failureLocation, options);
    return true;
  } else {
    alert ("Geolocation is not supported in your browser!")
  }
  return false;
}

export default getGeoLocation;