const currentLocation = {locality: 'Multan'};
const savedTheme = localStorage.getItem('rainify:theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const theme = {mode: savedTheme || (systemPrefersDark.matches ? 'dark' : 'light')};
if (!savedTheme) {
  const syncSystemTheme = ({matches}) => {
    theme.mode = matches ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', matches);
    document.body.classList.toggle('light-theme', !matches);
    document.querySelector('#light-toggle')?.classList.toggle('active-toggle', !matches);
    document.querySelector('#dark-toggle')?.classList.toggle('active-toggle', matches);
  };
  if (systemPrefersDark.addEventListener) systemPrefersDark.addEventListener('change', syncSystemTheme);
  else systemPrefersDark.addListener?.(syncSystemTheme);
}
const currentTab = {
  tab: 'today'
}
const weather = {
  setWeather: function (data) {
    this._current = data.currentConditions || '';
    this._today = data.days[0] || '';
    this._tomorrow = data.days[1] || '';
    this._next12Days = data.days.slice(2, 14) || '';
    this._location = {city: currentLocation.city} || {city: ''};
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
    if (type === 'metric') {
      this._temp = '°C';
      this._visibility = 'Km';
      this._pressure = 'hPa';
      this._speed = 'Km/h';
      this._dew = '°C';
      this.current = 'metric'
    } else {
      this._temp = '°F';
      this._visibility = 'Mi';
      this._pressure = 'inHg';
      this._speed = 'Mi/h';
      this._dew = '°F';
      this.current = 'us';
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

function hPaToinHg(value) {
  return (value / 33.86).toFixed(1);
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
  } else if (value > 22.5 && value <= 67.5) {
    winddir = "NE";
  } else if (value > 67.5 && value <= 112.5 ) {
    winddir = 'E';
  } else if (value > 112.5 && value <= 157.5) {
    winddir = 'SE';
  } else if (value > 157.5 && value <= 202.5) {
    winddir = 'S';
  } else if (value > 202.5 && value <=247.5) {
    winddir = 'SW';
  } else if (value > 247.5 && value <= 292.5) {
    winddir = 'W';
  } else if (value > 292.5 && value <= 337.5) {
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
    { limit: 3, adj: 'calm', advice: 'great conditions for an easy walk or relaxed outdoor time' },
    { limit: 7, adj: 'light', advice: 'comfortable for most plans, with only a gentle breeze' },
    { limit: 15, adj: 'breezy', advice: 'fine for going out, though light layers may move around' },
    { limit: 25, adj: 'strong', advice: 'secure loose items and expect the wind to be noticeable' },
    { limit: 35, adj: 'very strong', advice: 'take care outdoors and avoid exposed routes if possible' },
    { limit: Infinity, adj: 'dangerous', advice: 'consider postponing non-essential outdoor plans' }
  ];

  // 2. Find the first threshold that is greater than or equal to current speed
  // Default to a "calm" state if speed is 0 or negative
  const match = thresholds.find(thresh => speed <= thresh.limit)
  || { adj: 'calm', advice: 'It is a still day.' };

  const windDirection = directions[winddir] || winddir || 'variable direction';

  return `A ${match.adj} wind from the ${windDirection}; ${match.advice}.`;
}

const iconMapping = {
  "snow": "wi-snow",
  "snow-showers-day": "wi-day-snow",
  "snow-showers-night": "wi-night-snow",
  "thunder-rain": "wi-thunderstorm",
  "thunder-showers-day": "wi-day-storm-showers",
  "thunder-showers-night": "wi-night-storm-showers",
  "rain": "wi-rain",
  "showers-day": "wi-day-showers",
  "showers-night": "wi-night-showers",
  "fog": "wi-fog",
  "wind": "wi-strong-wind",
  "cloudy": "wi-cloudy",
  "partly-cloudy-day": "wi-day-cloudy",
  "partly-cloudy-night": "wi-night-alt-cloudy",
  "clear-day": "wi-day-sunny",
  "clear-night": "wi-night-clear"
};

function getWeatherIcon(vcIcon) {
  // Default to 'na' if the icon isn't in our list
  const iconClass = iconMapping[vcIcon] || "wi-na";
  return iconClass;
}

function inchTomm(inch) {
  return (25.4 * inch).toFixed(2);
}

function convertEpochTohourAndMin(epoch) {
  const time = [0, 0];
  time[0] = Math.trunc(epoch / 3600);
  time[1] = Math.trunc((epoch - time[0] * 3600) / 60);
  return time;
}
function getNext24Hours(today, tomorrow, currentHour ) {
  const next24Hours = [];
  for (let i = 0, j = Number(currentHour) + 1, k = 0; i < 24; i++) {
    if (j < 24) {
      next24Hours.push(today.hours[j])
      j++;
    } else {
      next24Hours.push(tomorrow.hours[k]);
      k++;
    }
  }
  return next24Hours;
}
function getNext24HoursPrecip(next24Hours) {
  let totalPrecip = 0;
  for (const hour of next24Hours) {
    totalPrecip += hour.precip;
  }
  return totalPrecip;
}

const PINNED_LOCATIONS_KEY = 'rainify:pinned-locations';

function getPinnedLocations() {
  try {
    const saved = JSON.parse(localStorage.getItem(PINNED_LOCATIONS_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(location => typeof location === 'string') : [];
  } catch {
    return [];
  }
}

function togglePinnedLocation(location) {
  const normalized = location.trim();
  const pinned = getPinnedLocations();
  const index = pinned.findIndex(item => item.toLowerCase() === normalized.toLowerCase());
  if (index >= 0) pinned.splice(index, 1);
  else pinned.unshift(normalized);
  try {
    localStorage.setItem(PINNED_LOCATIONS_KEY, JSON.stringify(pinned.slice(0, 8)));
  } catch (error) {
    console.error('Unable to save pinned location', error);
  }
  return pinned;
}

async function getSearchSuggestions(query, signal) {
  if (!query.trim()) return null;
  const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`, { signal });
  if (!response.ok) throw new Error(`Suggestions returned Status: ${response.status}`);
  const data = await response.json();

  return data.features.map(feature => {
    const {name, city, country} = feature.properties;
    return [name, city, country].filter(Boolean).join(', ');
  }).filter(Boolean);
}

function handleSuggestion(value) {
  const searchInput = document.querySelector('.search-input');
  searchInput.value = value;
  const searchBtn = document.querySelector('.search-btn');
  searchBtn.click();
}

export {
  currentLocation, 
  units, 
  weather, 
  theme,
  currentTab,
  toCelsius,
  MiToKm,
  hPaToinHg,
  createWindDescription, 
  findWindDirection, 
  getMoonphaseString,
  getWeatherIcon, 
  inchTomm,
  convertEpochTohourAndMin, 
  getNext24Hours,
  getNext24HoursPrecip,
  getSearchSuggestions,
  getPinnedLocations,
  togglePinnedLocation,
  handleSuggestion
};