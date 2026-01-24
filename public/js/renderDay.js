import { createContainer, createElement, createLabeledElement, createAnHour, createLabeledCard, createIcon, createButton} from "./components.js";
import { units, toCelsius, MiToKm, createWindDescription, findWindDirection, getWeatherIcon, inchTomm, convertEpochTohourAndMin, getNext24Hours, getNext24HoursPrecip, getMoonphaseString } from "./utils.js";

const main = document.querySelector('#main');

function renderTempAndDescription(temp, condition, icon, low, high){
  const parent = document.getElementById('temp-and-description')

  if (units.temp === '°C') {
    temp = toCelsius(temp);
    low = toCelsius(low);
    high = toCelsius(high);
  }
  temp = `${temp}${units.temp}`;
  low = `${low}${units.temp}`;
  high = `${high}${units.temp}`;
  icon = getWeatherIcon(icon);
  const weatherIcon = createIcon(`wi wi-${icon}`);
  const tempElement = createElement(temp, 'value');
  const tempContainer = createContainer('temp-and-icon', 'flex-row xl bold',tempElement, weatherIcon);
  const lowElem = createLabeledElement('low-container', 'L: ', low);
  const highElem = createLabeledElement('high-container', 'H: ', high);
  const lowHigh = createContainer('low-high', 'flex-column', lowElem, highElem);
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
  const feelsIcon = createIcon('wi wi-thermometer', 'feels-icon');
  const feelslike = createLabeledCard('FEELS', feelsIcon, feels, 'feels-like', feelsDescription);
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

function renderPressure(pressure, type){
  const parent = document.getElementById('Pressure-container');
  let description = '';
  if (pressure < 980) {
    description = 'Very low pressure. Expect severe weather and strong winds';
  } else if (pressure < 1000) {
    description = 'Low pressure. Expect unsettled weather, clouds, or rain.';
  } else if (pressure < 1025 && type === 'today' ) {
    description = 'Pressure is normal. Conditions are typical and stable.';
  } else if (pressure < 1025 && type === 'tomorrow') {
    description = 'Pressure will be Normal. Conditions will be typical and stable';
  }else if (pressure < 1040) {
    description = 'High pressure. Expect clear skies and calm, dry weather.';
  } else if (pressure > 1040 ) {
    description = 'Very high pressure. Very stable, dry, and cool conditions.';
  }
  pressure = `${pressure} ${units.pressure}`;
  const pressureIcon = createIcon('wi wi-barometer', 'pressure-icon');
  const pressureCard = createLabeledCard('PRESSURE',pressureIcon, pressure, '', description);
  if (!parent) {
    const pressureContainer = createContainer('Pressure-container', '', pressureCard );
    main.appendChild(pressureContainer);
  } else {
    parent.replaceChildren();
    parent.append(pressureCard);
  }
}

function renderHumidityDew(humidity, dew, type) {
  const parent = document.getElementById('Humidity-container');
  let dewDescription = '';
  if (type === 'today') dewDescription = `The dew point is ${dew}${units.dew} right now.`;
  else dewDescription = `The dew point is expected to be ${dew}${units.dew}.`
  const humidityIcon = createIcon('wi wi-humidity', 'humidity-icon');
  const humidtyCard = createLabeledCard('HUMIDITY', humidityIcon, `${humidity}%`, '', dewDescription);
  if (!parent) {
    const humidtyContainer = createContainer('Humidity-container', '', humidtyCard);
    main.append(humidtyContainer);
  } else {
    parent.replaceChildren();
    parent.appendChild(humidtyCard);
  }
}

function renderVisibility(visibility, reason, type) {
  const parent = document.getElementById('Visibility-container');
  let limit = 5;
  if (units.visibility === 'Km') {
    visibility = MiToKm(visibility);
    limit = MiToKm(limit);
  }
  reason === 'fog' ? reason = 'Fog' : reason ='Smoke';
  let description;
  visibility < limit ? description = `${reason} is affecting visiblity`: description = 'Visiblity is Normal';
  if (type === 'tomorrow' ) {
    visibility < limit ? description = `${reason} will be affecting visbility` : description = 'Visbility will be Normal';
  }
  const visibilityIcon = createIcon('wi wi-fog', 'visibility-icon');
  const visibilityCard = createLabeledCard('VISIBLITY', visibilityIcon, `${visibility}${units.visibility}`, '', description);
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

  const uvIcon = createIcon('wi wi-day-sunny');
  const uvCard = createLabeledCard('UV INDEX', uvIcon, uvindex, '', description, uvBar);

  if (!parent) {
    const uvIndexContainer = createContainer('Uv-index-container', '', uvCard);
    main.append(uvIndexContainer);
  } else {
    parent.replaceChildren();
    parent.append(uvCard);
  }
}

function renderPrecip(precip = 0, next24HourPrecip, preciptype, type) {
  const parent = document.getElementById('Precipitation-container');
  precip = inchTomm(precip);
  next24HourPrecip = inchTomm(next24HourPrecip);
  let description = '';

  if (precip > 0 && type === 'today') {
    description = `Currently ${precip} mm of ${preciptype} is falling.`
  } else if (next24HourPrecip > 0) {
    let intensity = "";
    next24HourPrecip < 10 ? intensity = 'Light' : intensity = 'Heavy';
    description = `${intensity} ${preciptype} expected. Total of ${next24HourPrecip} mm in the next 24 hours`;
  } else {
    description = `No ${preciptype} is expected in next 24h`
  }
  let icon = 'rain';
  if (preciptype && preciptype[0] === 'snow') icon = 'snow';
  const precipIcon = createIcon(`wi wi-${icon}`);
  const precipCard = createLabeledCard('PRECIPITATION', precipIcon, `${precip} mm`, '', description);

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
  const windGustElem = createLabeledElement('wind-gust medium', 'GUSTS', windgustWithUnits);
  const windDirElem = createLabeledElement('wind-dir medium', 'DIRECTION', winddir);
  const windDescription = createWindDescription(windspeed, winddir);
  const wind = createContainer('wind-container', '', windGustElem, windDirElem);

  const windIcon = createIcon('wi wi-windy');
  const windCard = createLabeledCard('WIND', windIcon, windspeedWithUnits, '', windDescription, wind);
  if (!parent) {
    const windStatus = createContainer('Wind-status-container', 'flex-column', windCard);
    main.append(windStatus);
  } else {
  parent.replaceChildren();
  parent.append(windCard);
  }
}

function renderSunRiseAndSet(sunrise, sunset, sunriseEpoch, sunsetEpoch, timeEpoch, type) {
  let description = '';
  let icon = '';
  if (sunriseEpoch - timeEpoch > 60) {
    const [hour, minutes] = convertEpochTohourAndMin(sunriseEpoch - timeEpoch);
    description = `Sun will rise in ${hour} hr and ${minutes} min`;
    icon = 'sunrise';
  } else if (sunriseEpoch - timeEpoch < 60 && sunriseEpoch - timeEpoch > 0){
    description = 'Sun is rising now.';
    icon = 'sunrise';
  } else if (sunsetEpoch - timeEpoch > 60) {
    const [hour, minutes] = convertEpochTohourAndMin(sunsetEpoch - timeEpoch);
    description = `Sun will set in ${hour} hr and ${minutes} min`;
    icon = 'sunset';
  } else if (sunsetEpoch - timeEpoch < 60 && sunsetEpoch - timeEpoch > 0) {
    description = 'Sun is setting now';
    icon = 'sunset';
  }
  const parent = document.getElementById('Sun-rise-and-set-container');
  const sunriseElem = createLabeledElement('', 'RISE', sunrise  );
  const sunsetElem = createLabeledElement('', 'SET', sunset);
  const sunRiseAndSet = createContainer('sun-rise-and-set', '', sunriseElem, sunsetElem);
  const sunIcon = createIcon(`wi wi-${icon}`);
  const sunCard = createLabeledCard('SUN', sunIcon, '', '', description,sunRiseAndSet );
  if (!parent) {
    const sunStatus = createContainer('Sun-rise-and-set-container', 'flex-column',sunCard);
    main.append(sunStatus);
  } else {
    parent.replaceChildren();
    parent.append(sunCard);
  }
}

function renderMoonPhase(moonphaseDegree) {
  const moonphaseValue = createElement(getMoonphaseString(moonphaseDegree), 'moonphase-value');
  
}
function renderNextHours(hours){
  const cardSize = 320;
  const parent = document.getElementById('hours-carousel');
  const prevButton = document.createElement('button');
  const prevIcon = createIcon('wi wi-direction-left', 'prev-icon');
  prevButton.type = 'button';
  prevButton.className = 'hours-btn prev';
  prevButton.append(prevIcon);
  const nextButton = document.createElement('button');
  const nextIcon = createIcon('wi wi-direction-right', 'next-icon');
  nextButton.className = 'hours-btn next';
  nextButton.append(nextIcon);
  const nextHoursDom = [];
  for (const hour of hours) {
    nextHoursDom.push(createAnHour(hour));
  }
  const hoursContainer = createContainer('hours-container', 'flex-row', ...nextHoursDom );
  prevButton.addEventListener('click', () => {
    hoursContainer.scrollBy({left: -cardSize, behavior: "smooth"})
  })
  nextButton.addEventListener('click', () => {
    hoursContainer.scrollBy({left: cardSize, behavior: "smooth"});
  })
  if (!parent) {
    const nextHours = createContainer('hours-carousel', 'flex-row', prevButton, hoursContainer, nextButton);
    nextHours.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevButton.click();
      if (e.key === 'ArrowRight') nextButton.click();
    })
    main.appendChild(nextHours);
  } else {
    parent.replaceChildren();
    parent.append(prevButton, hoursContainer, nextButton);
  }
 
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
  const condition = today.description;
  const low = today.tempmin;
  const high = today.tempmax;
  const feels = current.feelslike;
  const dew = current.dew || today.dew;
  const humidity = current.humidity !== null ? current.humidity : today.humidity;
  const pressure = current.pressure !== null ? current.pressure : today.pressure;
  const visibility = current.visibility !== null ? current.visibility : today.visibility;
  const uvindex = current.uvindex || 0;
  const currentWindspeed = current.windspeed;
  const currentWinddir = current.winddir;
  const todayWindspeed = today.windspeed;
  const todayWinddir = today.winddir;
  const icon = current.icon;
  const precip = current.precip;
  const preciptype = today.preciptype ? today.preciptype[0] : 'rain';
  const todayWindgust = today.windgust || 0;
  const sunrise = today.sunrise;
  const sunset = today.sunset;
  const sunriseEpoch = today.sunriseEpoch;
  const sunsetEpoch = today.sunsetEpoch;
  let timeEpoch = Math.floor(Date.now() / 1000);
  const date = new Date();
  let currentHour = '00'
  if (type === 'today') {
    currentHour = date.getHours();
    if (currentHour < 10) currentHour = `0${currentHour}`;
  }
  let next24Hours;
  if (type === 'today') next24Hours = getNext24Hours(today, tomorrow, currentHour);
  else next24Hours = getNext24Hours(tomorrow, '', -1); // use -1 because j + 1 is handling index;
  const next24HoursPrecip = getNext24HoursPrecip(next24Hours);
  // DOM Elements
  renderTempAndDescription(temp, condition, icon, low, high);
  renderFeels(temp, feels);
  renderPressure(pressure, type);
  renderHumidityDew(humidity, dew, type);
  renderVisibility(visibility, icon, type);
  renderUvIndex(uvindex);
  renderPrecip(precip, next24HoursPrecip, preciptype, type)
  renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir, todayWindgust);
  renderSunRiseAndSet(sunrise, sunset, sunriseEpoch, sunsetEpoch, timeEpoch, type);
  renderNextHours(next24Hours);
}

export {renderDay};