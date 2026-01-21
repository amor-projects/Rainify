import { createContainer, createElement, createLabeledElement, createAnHour, createLabeledCard} from "./components.js";
import { units, toCelsius, MiToKm, createWindDescription, findWindDirection, insertWeatherIcon } from "./utils.js";

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
  
  if (units.temp == '°C') {
    dew = toCelsius(dew);
  };
  dew += units.dew;
  humidity += '%';
  pressure += ` ${units.pressure}`;

  const dewElem = createLabeledElement('dew-container', 'Dew', dew);
  const humidityElem = createLabeledElement('humidity-container', 'Humidity', humidity);
  const pressureElem = createLabeledElement('pressure-container', 'Pressure', pressure);

  if (!parent) {
    const dewHumidityPressure = createContainer('dew-humidity-pressure', 'flex-column card', dewElem, humidityElem, pressureElem);
    main.appendChild(dewHumidityPressure);
    return 1;
  }
  parent.replaceChildren();
  parent.append(dewElem, humidityElem, pressureElem);
  return 0;
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

function renderVisibilityUvCloudCover(visibility, uvindex, cloudCover){
  const parent = document.getElementById('visibility-uv-cloud');
  if (units.visibility == 'Km') {
    visibility = MiToKm(visibility);
  }
  
  visibility +=` ${units.visibility}`;
  cloudCover += '%';

  const visibilityElem = createLabeledElement('visibility-container', 'Visibility', visibility);
  const cloudCoverElem = createLabeledElement('cloud-cover-container', 'Cloud Cover', cloudCover);
  const uvindexElem = createLabeledElement('uvindex-container', 'UV Index', uvindex);

  if (!parent) {
    const visibilityUvCloud = createContainer('visibility-uv-cloud', 'flex-column card', visibilityElem, cloudCoverElem, uvindexElem);
    main.appendChild(visibilityUvCloud);
    return 1;
  }
  parent.replaceChildren();
  parent.append(visibilityElem, cloudCoverElem, uvindexElem);
  return 0;
}

function renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir){
  const parent = document.getElementById('wind-status');
  const windspeed = currentWindspeed || todayWindspeed;
  let winddir = currentWinddir || todayWinddir;
  if (units.speed == 'Km/h') {
    windspeedWithUnits = MiToKm (windspeed);
  }
  const windspeedWithUnits = `${windspeed} ${units.speed}`;
  winddir = findWindDirection(winddir);
  const windspeedElem = createElement(windspeedWithUnits, 'wind-speed bold large');
  const windDescription = createWindDescription(windspeed, winddir);
  const windDescriptionElem = createElement(windDescription, 'wind-description');
  const wind = createContainer('wind-container', 'flex-row', windspeedElem);

  if (!parent) {
    const windStatus = createContainer('wind-status', 'flex-column card', wind, windDescriptionElem);
    main.append(windStatus);
    return 1;
  }
  parent.replaceChildren();
  parent.append(wind, windDescriptionElem);
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

function renderDay (type, current, today = null)  {
  if (today === null) today = current;
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
  const date = new Date();
  let currentHour = '00'
  if (type === 'today') {
    currentHour = date.getHours();
    if (currentHour < 10) currentHour = `0${currentHour}`;
  }
  
  // DOM Elements
  renderTempAndDescription(temp, condition, low, high);
  renderFeels(temp, feels);
  // renderDewHumidityPressure(dew, humidity, pressure);
  renderHumidityDew(humidity, dew);
  renderVisibility(visibility, icon);
  renderUvIndex(uvindex);
  // renderVisibilityUvCloudCover(visibility, uvindex, cloudCover);
  renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir);
  const nextHours = createElement('Next Hours', 'large next-hours-title');
  main.append(nextHours);
  renderNextHours(hours, String(currentHour));
  insertWeatherIcon(icon, 'temp-and-desc-icon');
  insertAllHourIcons();
}

export {renderDay};