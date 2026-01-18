const currentLocation = {locality: 'Multan', countryName: 'Pakistan'};

const weather = {
  setWeather: function (data) {
    this._current = data.currentConditions || '';
    this._today = data.days[0] || '';
    this._tomorrow = data.days[1] || '';
    this._next12Days = data.days.slice(2, 13) || '';
    this._location = {city: currentLocation.city, country: currentLocation.countryName} || {city: '', country: ''};
  },
  get current() {
    return this._current;
  },
  get today() {
    return this._today;
  },
  get tomorrow () {
    return this._tomorrow;
  },
  get next12Days () {
    return this._next12Days;
  }
}
const units = {
  _temp: '°F',
  _visibility: 'Mi',
  _pressure: 'inHg',
  _speed: 'Mi/h',
  _dew: '°F',
  setUnit: function (type) {
    if (type == 'Metric') {
      this._temp = '°C',
      this._visibility = 'Km',
      this._pressure = 'inHg',
      this._speed = 'Km/h',
      this._dew = '°C';
    }
  },
  get temp () {
    return this._temp;
  },
  get visibility () {
    return this._visibility;
  },
  get pressure () {
    return this._pressure;
  },
  get speed () {
    return this._speed;
  },
  get dew () {
    return this._dew;
  }
}

function toCelsius(value) {
  return ((value -32 )* (5/9)).toFixed(1);
}

function MiToKm(value) {
  return (value * 1.60934).toFixed(1);
}

function getMoonphaseString(phase) {
  if (phase === 0 || phase === 1) return "New Moon";
  if (phase === 0.25) return "First Quarter";
  if (phase === 0.5) return "Full Moon";
  if (phase === 0.75) return "Last Quarter";
  if (phase > 0 && phase < 0.25) return "Waxing Crescent";
  if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
  if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
  if (phase > 0.75 && phase < 1) return "Waning Crescent";
  return "Unknown";
}
// Reference Directions

// 337.5° - 22.5°	North (N)
// 22.5° - 67.5°	Northeast (NE)
// 67.5° - 112.5°	East (E)
// 112.5° - 157.5°	Southeast (SE)
// 157.5° - 202.5°	South (S)
// 202.5° - 247.5°	Southwest (SW)
// 247.5° - 292.5°	West (W)
// 292.5° - 337.5°	Northwest (NW)

function findWindDirection(value) {
  let winddir = '';
  if (value > 337.5 || value <= 22.5) {
    winddir = 'N';
  } else if (value > 22.5 || value <= 67.5) {
    winddir = "NE";
  } else if (value > 67.5 || value <= 112.5 ) {
    winddir = 'E';
  } else if (value > 112.5 || value <= 157.5) {
    winddir = 'SE';
  } else if (value > 157.5 || value <= 202.5) {
    winddir = 'S';
  } else if (value > 202.5 || value <=247.5) {
    winddir = 'SW';
  } else if (value > 247.5 || value <= 292.5) {
    winddir = 'W';
  } else if (value > 292.5 || value <= 337.5) {
    winddir = 'NW';
  } else {
    winddir = "Unknown";
  }
  return winddir;
}

const advices = {
  lazy: "perfect for a quiet walk",
  soft: "jackets won't stay still",
  brisk: "loose items should be secured",
  strong: "not a day for light travel",
  blasting: "best to stay indoors",
  relentless: "conditions can become dangerous"
}
const directions = {
  N: 'North',
  NE: 'North East',
  NW: 'North West',
  S: 'South',
  SE: 'South East',
  SW: 'South West',
  E: 'East',
  W: 'West'
}

function createWindDescription(windspeed, winddir) {
  const speed = Number(windspeed);
  const thresholds = [
    { limit: 3, adj: 'lazy', advice: advices.lazy },
    { limit: 7, adj: 'soft', advice: advices.soft },
    { limit: 15, adj: 'brisk', advice: advices.brisk },
    { limit: 25, adj: 'strong', advice: advices.strong },
    { limit: 35, adj: 'powerful blasting', advice: advices.blasting },
    { limit: Infinity, adj: 'relentless', advice: advices.relentless }
  ];

  // 2. Find the first threshold that is greater than or equal to current speed
  // Default to a "calm" state if speed is 0 or negative
  const match = thresholds.find(thresh => speed <= thresh.limit)
  || { adj: 'calm', advice: 'It is a still day.' };

  const windDirection = directions[winddir] || 'variable direction';

  return `A ${match.adj} wind from the ${windDirection}; ${match.advice}`;
}

export {
  currentLocation, 
  units, 
  weather, 
  toCelsius,
  MiToKm, 
  createWindDescription, 
  findWindDirection, 
  getMoonphaseString
};