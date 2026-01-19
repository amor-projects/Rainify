import { createContainer, createElement, createLabeledElement, createAnHour} from "./components.js";
import { units, toCelsius, MiToKm, createWindDescription, findWindDirection } from "./utils.js";

const main = document.querySelector('#main');

function renderTempAndDescription(temp, description){
  const parent = document.getElementById('temp-and-description')
  if (units.temp == '°C') {
    temp = toCelsius(temp);
  }
  const tempElement = createElement(temp, 'value xl bold');
  const descriptionElement = createElement(description, 'description bold large');
  if (!parent) {
    const tempAndDescription = createContainer('temp-and-description', 'flex-column card', tempElement, descriptionElement);
    main.append(tempAndDescription);
    return 1;
  }
  parent.replaceChildren();
  parent.append(tempElement, descriptionElement);
  return 0;
}

function renderLowHighFeels(low, high, feels){
  const parent = document.getElementById('low-high-feels');
  if (units.temp == '°C') {
    low = toCelsius(low);
    high = toCelsius(high);
    feels = toCelsius(feels);
  }
  low += units.temp;
  high += units.temp;
  feels += units.temp;
  const lowElem = createLabeledElement('low-container', 'Low', low);
  const highElem = createLabeledElement('high-container', 'High', high);
  const feelsElem = createLabeledElement('feels-container', 'Feels', feels);
  
  if (!parent) {
    const lowHighFeels = createContainer('low-high-feels', 'flex-column card', lowElem, highElem, feelsElem);
    main.appendChild(lowHighFeels);
    return 1;
  }
  parent.replaceChildren();
  parent.append(lowElem, highElem, feelsElem);
  return 0;
}

function renderDewHumidityPressure(dew, humidity, pressure){
  const parent = document.getElementById('dew-humidity-pressure');
  
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
  if (length > 7) {
    upcomingHours.splice(7,);
  } else  {
    upcomingHours = hours.slice(17, 24);
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
  const temp = current.temp;
  const description = today.description;
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
  const date = new Date();
  let currentHour = '00'
  if (type === 'today') {
    currentHour = date.getHours();
    if (currentHour < 10) currentHour = `0${currentHour}`;
  }
  
  // DOM Elements
  renderTempAndDescription(temp, description);
  renderLowHighFeels(low, high, feels);
  renderDewHumidityPressure(dew, humidity, pressure);
  renderVisibilityUvCloudCover(visibility, uvindex, cloudCover);
  renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir);
  renderNextHours(hours, String(currentHour));
}

export {renderDay};