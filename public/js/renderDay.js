import { createContainer, createElement, createLabeledElement, createAnHour, createLabeledCard, createIcon} from "./components.js";
import { units, toCelsius, MiToKm, createWindDescription, findWindDirection, getWeatherIcon, inchTomm, convertEpochTohourAndMin, getNext24Hours, getNext24HoursPrecip, hPaToinHg} from "./utils.js";

const main = document.querySelector('#main');

function createHelpfulSummary(condition, precipprob, windspeed, windgust, type) {
  const period = type === 'today' ? 'today' : type === 'tomorrow' ? 'tomorrow' : 'that day';
  const cleanCondition = String(condition || 'Conditions vary').replace(/[.!?]+$/, '');
  if (precipprob >= 60) {
    return `${cleanCondition}. Rain is likely ${period}, so keep an umbrella close and plan for slower travel.`;
  }
  if (precipprob >= 30) {
    return `${cleanCondition}. There is a chance of rain ${period}; a light layer or compact umbrella may be useful.`;
  }
  if (windspeed >= 20 || windgust >= 30) {
    return `${cleanCondition}. It will be breezy ${period}; secure loose items and expect a noticeable wind chill.`;
  }
  if (Number(windspeed) <= 5) {
    return `${cleanCondition}. Calm, comfortable conditions are expected ${period}—a good window to be outside.`;
  }
  return `${cleanCondition}. A generally comfortable day, with no major weather disruption expected ${period}.`;
}

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
  const weatherIcon = createIcon(`wi ${icon}`);
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
  const numericTemp = units.temp === '°C' ? Number(toCelsius(temp)) : Number(temp);
  const numericFeels = units.temp === '°C' ? Number(toCelsius(feels)) : Number(feels);
  if (units.temp === '°C') {
    feels = toCelsius(feels);
  }
  feels = `${feels}${units.temp}`;
  let feelsDescription;
  if (numericFeels < numericTemp) {
    feelsDescription = 'It feels colder than the actual temperature';
  } else if (numericFeels > numericTemp) {
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
    parent.replaceChildren();
    parent.appendChild(feelslike);
  }  
}

function renderPressure(pressure, type){
  const parent = document.getElementById('Pressure-container'); 
  let description = '';
  if (pressure < 980) {
    description = 'Low pressure can bring unsettled weather. Keep an eye on the rain and wind outlook.';
  } else if (pressure < 1000) {
    description = 'A changeable pattern is possible, so check the hourly outlook before longer plans.';
  } else if (pressure < 1025 && type === 'today' ) {
    description = 'Pressure is steady, with no strong signal of a major weather change.';
  } else if (pressure < 1025) {
    description = 'A balanced pressure pattern suggests fairly typical conditions.';
  }else if (pressure < 1040) {
    description = 'Higher pressure often supports calmer, drier weather and more settled plans.';
  } else if (pressure > 1040 ) {
    description = 'A very settled pattern is likely, though clear skies can mean cooler mornings.';
  }
  if (units.pressure === 'inHg') {
    pressure = hPaToinHg(pressure);
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
  if (units.dew === '°C') {
    dew = toCelsius(dew);
  }
  let dewDescription;
  const humidityAdvice = humidity >= 75
    ? 'The air may feel muggy, especially during activity.'
    : humidity <= 35
      ? 'The air is dry, so water and moisturizer may be useful.'
      : 'Humidity should feel broadly comfortable.';
  dewDescription = `${type === 'today' ? `The dew point is ${dew}${units.dew} right now.` : `The dew point should be around ${dew}${units.dew}.`} ${humidityAdvice}`;
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
  let limit = 5.0;
  if (units.visibility === 'Km') {
    visibility = MiToKm(visibility);
    limit = MiToKm(limit);
  }
  let description;
  if (reason === 'fog') {
    parseFloat(visibility) < limit ? description = 'Fog may reduce contrast; allow extra time for driving.' : description = 'Fog is not currently limiting visibility.';
  } else {
    parseFloat(visibility) < limit ? description = 'Reduced visibility may affect driving and distant views.' : description = 'Visibility should be good for travel and outdoor plans.';
  }
  if (type === 'tomorrow' ) {
    parseFloat(visibility) < limit ? description = `Visibility may be reduced ${type === 'tomorrow' ? 'tomorrow' : 'that day'}; allow extra travel time.` : description = 'Visibility should be good for travel.';
  }
  const visibilityIcon = createIcon('wi wi-fog', 'visibility-icon');
  const visibilityCard = createLabeledCard('VISIBILITY', visibilityIcon, `${visibility}${units.visibility}`, '', description);
  if (!parent) {
    const visibilityContainer = createContainer('Visibility-container', '', visibilityCard);
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
  let description;
  if (uvindex <= 2) {
    description = 'Low risk for sun exposure. Sunglasses are still useful in bright conditions.';
  } else if (uvindex < 5) {
    description = 'Some protection is sensible around midday; seek shade during longer outdoor periods.';
  } else if (uvindex < 7) {
    description = 'Protection is recommended: use sunscreen, sunglasses, and shade around midday.';
  } else if (uvindex < 10) {
    description = 'Very high exposure risk. Limit direct sun and reapply sunscreen regularly.'
  } else {
    description = 'Extreme exposure risk. Avoid direct sun where possible and protect exposed skin.';
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
  let description;

  if (precip > 0 && type === 'today') {
    description = `Currently ${precip} mm of ${preciptype} is falling; allow extra time and use rain protection.`
  } else if (next24HourPrecip > 0) {
    let intensity;
    next24HourPrecip < 10 ? intensity = 'Light' : intensity = 'Heavy';
    description = `${intensity} ${preciptype} is possible in the next 24 hours, with about ${next24HourPrecip} mm expected.`;
  } else {
    description = `No meaningful ${preciptype} is expected in the next 24 hours, so outdoor plans look lower-risk.`
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
  let windspeedWithUnits;
  if (units.speed === 'Km/h') {
    windspeedWithUnits = `${MiToKm (windspeed)} ${units.speed}`;
    todayWindGust = MiToKm(todayWindGust);
  } else {
    windspeedWithUnits = `${windspeed} ${units.speed}`;
  }
  const windgustWithUnits = `${todayWindGust} ${units.speed}`;
  winddir = findWindDirection(winddir);
  const windGustElem = createLabeledElement('wind-gust', 'GUSTS', windgustWithUnits);
  const windDirElem = createLabeledElement('wind-dir', 'DIRECTION', winddir);
  const windDescription = createWindDescription(windspeed, winddir);
  const wind = createContainer('wind-container', 'flex-column', windGustElem, windDirElem);

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
  if (type === 'tomorrow') {
    description = `Sunrise at ${sunrise}, sunset at ${sunset}.`;
    icon = 'day-sunny';
  } else if (sunriseEpoch - timeEpoch > 60) {
    const [hour, minutes] = convertEpochTohourAndMin(sunriseEpoch - timeEpoch);
    description = `Sun will rise in ${hour} hr and ${minutes} min`;
    icon = 'sunrise';
  } else if (sunriseEpoch - timeEpoch >= 0) {
    description = 'Sun is rising now.';
    icon = 'sunrise';
  } else if (sunsetEpoch - timeEpoch > 60) {
    const [hour, minutes] = convertEpochTohourAndMin(sunsetEpoch - timeEpoch);
    description = `Sun will set in ${hour} hr and ${minutes} min`;
    icon = 'sunset';
  } else if (sunsetEpoch - timeEpoch >= 0) {
    description = 'Sun is setting now.';
    icon = 'sunset';
  } else {
    description = 'Sun has set for today.';
    icon = 'night-clear';
  }
  const sunIcon   = createIcon(`wi wi-${icon}`, 'sun-icon');
  const titleLabel = createElement('SUN', 'medium');
  const titleRow   = createContainer('SUN-title', 'flex-row gray', sunIcon, titleLabel);
  const riseElem   = createLabeledElement('sun-rise-row', 'RISE', sunrise);
  const setElem    = createLabeledElement('sun-set-row',  'SET',  sunset);
  const timesGrid  = createContainer('sun-times', 'flex-column', riseElem, setElem);
  const descElem   = createElement(description, 'small');
  const sunCard    = document.createElement('div');
  sunCard.id        = 'SUN-card';
  sunCard.className = 'card flex-column';
  sunCard.append(titleRow, timesGrid, descElem);
  const parent = document.getElementById('Sun-rise-and-set-container');
  if (!parent) {
    const sunStatus = createContainer('Sun-rise-and-set-container', 'flex-column', sunCard);
    main.append(sunStatus);
  } else {
    parent.replaceChildren(sunCard);
  }
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
  const condition = createHelpfulSummary(
    today.description || today.conditions,
    today.precipprob || 0,
    current.windspeed || today.windspeed || 0,
    today.windgust || 0,
    type
  );
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
  const timeEpoch = current.datetimeEpoch;
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