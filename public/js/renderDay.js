import { createContainer, createElement, createLabeledElement, createAnHour, createLabeledCard} from "./components.js";
import { units, toCelsius, MiToKm, createWindDescription, findWindDirection, insertWeatherIcon, inchTomm } from "./utils.js";

const main = document.querySelector('#main');

function insertAllHourIcons() {
  const hourIcons = document.querySelectorAll('.hour-icon');
  hourIcons.forEach((icon) => {
    insertWeatherIcon(icon.dataset.icon, icon.id);
  });
}
function renderTempAndDescription(temp, condition, low, high){
  const parent = document.getElementById('temp-and-description')

  if (units.temp === '°C') {
    temp = toCelsius(temp);
    low = toCelsius(low);
    high = toCelsius(high);
  }
  temp = `${temp}${units.temp}`;
  low = `${low}${units.temp}`;
  high = `${high}${units.temp}`;
  condition = `Conditions are expected to be ${condition} throughout the day.`
  const icon = document.createElement('span');
  icon.id = 'temp-and-desc-icon';
  icon.classList.add('svg-icon');
  const tempElement = createElement(temp, 'value');
  const tempContainer = createContainer('temp-and-icon', 'flex-row xl bold',tempElement, icon);
  const lowElem = createLabeledElement('low-container', 'L: ', low);
  const highElem = createLabeledElement('high-container', 'H: ', high);
  const lowHigh = createContainer('low-high', 'small flex-column', lowElem, highElem);
  const descriptionElement = createElement(condition, 'description bold large');
  if (!parent) {
    const tempAndDescription = createContainer('temp-and-description', 'flex-column card', tempContainer, lowHigh, descriptionElement);
    main.append(tempAndDescription);
    return 1;
  }
  parent.replaceChildren();
  parent.append(tempContainer, lowHigh, descriptionElement);
  return 0;
}

function renderFeels(temp, feels){
  const parent = document.getElementById('Feels-container');
  if (units.temp == '°C') {
    feels = toCelsius(feels);
  }
  feels = `${feels}${units.temp}`;
  let feelsDescription = '';
  if (feels < temp) {
    feelsDescription = 'It feels colder than the actual temperature';
  } else if (feels > temp) {
    feelsDescription = 'It feels warmer than the actual temperature';
  } else {
    feelsDescription = 'Similar to the actual temperature';
  }
  const feelslike = createLabeledCard('Feels', feels, 'feels-like', feelsDescription);
  if (!parent) {
    const feelsContainer = document.createElement('div');
    feelsContainer.id = 'Feels-container';
    feelsContainer.appendChild(feelslike);
    main.append(feelsContainer);
  } else {
    parent.removeChildren();
    parent.appendChild(feelslike);
  }  
}

function renderPressure(pressure){
  const parent = document.getElementById('Pressure-container');
  let description = '';
  if (pressure < 980) {
    description = 'Very low pressure. Expect severe weather and strong winds';
  } else if (pressure < 1000) {
    description = 'Low pressure. Expect unsettled weather, clouds, or rain.';
  } else if (pressure < 1025 ) {
    description = 'Pressure is normal. Conditions are typical and stable.';
  } else if (pressure < 1040) {
    description = 'High pressure. Expect clear skies and calm, dry weather.';
  } else if (pressure > 1040 ) {
    description = 'Very high pressure. Very stable, dry, and cool conditions.';
  }
  pressure = `${pressure} ${units.pressure}`;
  const pressureCard = createLabeledCard('Pressure', pressure, '', description);
  if (!parent) {
    const pressureContainer = createContainer('Pressure-container', '', pressureCard );
    main.appendChild(pressureContainer);
  } else {
    parent.replaceChildren();
    parent.append(pressureCard);
  }
}

function renderHumidityDew(humidity, dew) {
  const parent = document.getElementById('Humidity-container');
  const dewDescription = `The dew point is ${dew}${units.dew} right now.`;
  const humidtyCard = createLabeledCard('Humidity', `${humidity}%`, '', dewDescription);
  if (!parent) {
    const humidtyContainer = createContainer('Humidity-container', '', humidtyCard);
    main.append(humidtyContainer);
  } else {
    parent.replaceChildren();
    parent.appendChild(humidtyCard);
  }
}

function renderVisibility(visibility, reason) {
  const parent = document.getElementById('Visibility-container');
  let limit = 5;
  if (units.visibility === 'Km') {
    visibility = MiToKm(visibility);
    limit = MiToKm(limit);
  }
  reason === 'fog' ? reason = 'Fog' : reason ='Smoke';
  let description;
  visibility < limit ? description = `${reason} is affecting visiblity`: description = 'Visiblity is Normal';
  const visibilityCard = createLabeledCard('Visiblity', visibility, '', description);
  if (!parent) {
    const visibilityContainer = createContainer('Visiblity-container', '', visibilityCard);
    main.append(visibilityContainer);
  } else {
    parent.replaceChildren();
    parent.appendChild(visibilityCard);
  }
}

function renderUvIndex (uvindex) {
  const parent = document.getElementById('Uv-index-container')
  const uvBar = document.createElement('div');
  uvBar.id = 'uv-bar';
  uvBar.className = 'uv-bar';
  const uvIndicator = document.createElement('div');
  uvIndicator.id = 'uv-dot';
  uvIndicator.className = 'uv-indicator';
  uvBar.appendChild(uvIndicator);
  const maxUV = 11;

  const displayIndex = Math.min(uvindex, maxUV);
  const percentage = (displayIndex / maxUV) * 100;
  uvIndicator.style.left = `${percentage}%`;
  let description = '';
  if (uvindex <= 2) {
    description = 'Low for the rest of the day';
  } else if (uvindex < 5) {
    description = 'Moderate, Seek shade during midday hours';
  } else if (uvindex < 7) {
    description = 'High, Protection highly recommended';
  } else if (uvindex < 10) {
    description = 'Very High, Take extra precautions'
  } else {
    description = 'Extreme, Unprotected skin can burn in minutes';
  }

  const uvCard = createLabeledCard('UV Index', uvindex, '', description, uvBar);

  if (!parent) {
    const uvIndexContainer = createContainer('Uv-index-container', '', uvCard);
    main.append(uvIndexContainer);
  } else {
    parent.replaceChildren();
    parent.append(uvCard);
  }
}

function renderPrecip(precip = 0, next24HourPrecip, preciptype) {
  const parent = document.getElementById('Precipitation-container');
  precip = inchTomm(precip);
  next24HourPrecip = inchTomm(next24HourPrecip);
  let description = '';

  if (precip > 0) {
    description = `Currently ${precip} of ${preciptype} is falling.`
  } else if (next24HourPrecip > 0) {
    let intensity = "";
    next24HourPrecip < 10 ? intensity = 'Light' : intensity = 'Heavy';
    description = `${intensity} ${preciptype} expected. Total of ${next24HourPrecip}mm in the next 24 hours`;
  } else {
    description = `No ${preciptype} is expected in next 24h`
  }

  const precipCard = createLabeledCard('Precipitation', precip, '', description);

  if (!parent) {
    const precipContainer = createContainer('Precipitation-container', '', precipCard);
    main.appendChild(precipContainer);
  } else {
    parent.replaceChildren();
    parent.append(precipCard);
  }
}

function renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir, todayWindGust = 0){
  const parent = document.getElementById('Wind-status-container');
  const windspeed = currentWindspeed || todayWindspeed;
  let winddir = currentWinddir || todayWinddir;
  if (units.speed == 'Km/h') {
    windspeedWithUnits = MiToKm (windspeed);
    todayWindGust = MiToKm(todayWindGust);
  }
  const windspeedWithUnits = `${windspeed} ${units.speed}`;
  const windgustWithUnits = `${todayWindGust} ${units.speed}`;
  winddir = findWindDirection(winddir);
  const windGustElem = createLabeledElement('wind-gust', 'Gusts', windgustWithUnits);
  const windDirElem = createLabeledElement('wind-dir', 'Direction', winddir);
  const windDescription = createWindDescription(windspeed, winddir);
  const wind = createContainer('wind-container', 'flex-column', windGustElem, windDirElem);

  const windCard = createLabeledCard('Wind', windspeed, 'flex-row', windDescription, wind);
  if (!parent) {
    const windStatus = createContainer('Wind-status-container', 'flex-column card', windCard);
    main.append(windStatus);
  } else {
  parent.replaceChildren();
  parent.append(windCard);
  }
}

function renderNextHours(hours, currentTime){
  const parent = document.getElementById('next-hours');
  const currentHour = Number(currentTime.slice(0, 2));
  const upcomingHoursDom = [];
  let upcomingHours = [];
  for (const hour of hours) {
    const time = Number(hour.datetime.slice(0, 2));
    if (time >= currentHour) {
      upcomingHours.push(hour);
    }
  }
  const length = upcomingHours.length;
  if (length > 6) {
    upcomingHours.splice(6,);
  } else  {
    upcomingHours = hours.slice(18, 24);
  }
  if (!parent) {
    for (const hour of upcomingHours) {
      const hourElem = createAnHour(hour);
      upcomingHoursDom.push(hourElem);
    }
    const nextHours = createContainer('next-hours', 'flex-row', ...upcomingHoursDom);
    main.appendChild(nextHours);
    return 1;
  }
  parent.replaceChildren();
  parent.append(...upcomingHoursDom);
  return 0;
}

function renderDay (type, current, today = null, tomorrow)  {
  if (type === 'tomorrow') {
    current = tomorrow;
    today = tomorrow;
  }
  const main = document.querySelector('#main');
  main.replaceChildren();
  main.classList.remove('days-view');
  const temp = current.temp;
  const condition = today.conditions;
  const low = today.tempmin;
  const high = today.tempmax;
  const feels = current.feelslike;
  const dew = current.dew || today.dew;
  const humidity = current.humidity !== null ? current.humidity : today.humidity;
  const pressure = current.pressure !== null ? current.pressure : today.pressure;
  const visibility = current.visibility !== null ? current.visibility : today.visibility;
  const uvindex = current.uvindex || 0;
  const cloudCover = current.cloudcover !== null ? current.cloudcover : today.cloudcover;
  const currentWindspeed = current.windspeed;
  const currentWinddir = current.winddir;
  const todayWindspeed = today.windspeed;
  const todayWinddir = today.winddir;
  const hours = today.hours;
  const icon = current.icon;
  const precip = current.precip;
  const tomorrowPrecip = tomorrow.precip;
  const preciptype = today.preciptype ? today.preciptype[0] : 'rain';
  const todayWindgust = today.windgust || 0;
  const date = new Date();
  let currentHour = '00'
  if (type === 'today') {
    currentHour = date.getHours();
    if (currentHour < 10) currentHour = `0${currentHour}`;
  }
  
  // DOM Elements
  renderTempAndDescription(temp, condition, low, high);
  renderFeels(temp, feels);
  renderHumidityDew(humidity, dew);
  renderVisibility(visibility, icon);
  renderUvIndex(uvindex);
  renderPressure(pressure);
  renderPrecip(precip, tomorrowPrecip, preciptype)
  renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir, todayWindgust);
  const nextHours = createElement('Next Hours', 'large next-hours-title');
  main.append(nextHours);
  renderNextHours(hours, String(currentHour));
  insertWeatherIcon(icon, 'temp-and-desc-icon');
  insertAllHourIcons();
}

export {renderDay};