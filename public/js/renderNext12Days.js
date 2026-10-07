import { createContainer, createElement, createIcon } from './components.js';
import {  getWeatherIcon, MiToKm, toCelsius, units } from './utils.js';
import { renderDay } from './renderDay.js';

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {weekday: 'short', month: 'short', day: 'numeric'})
    .format(new Date(`${value}T12:00:00`));
}

function displayTemperature(value) {
  return `${units.temp === '°C' ? toCelsius(value) : value}${units.temp}`;
}

function displayWind(value) {
  return `${units.speed === 'Km/h' ? MiToKm(value) : value} ${units.speed}`;
}

function dayAdvice(day) {
  if ((day.precipprob || 0) >= 60) return 'Keep rain protection close';
  if ((day.precipprob || 0) >= 30) return 'A little weather planning helps';
  if ((day.windspeed || 0) >= 20 || (day.windgust || 0) >= 30) return 'Breezy — secure loose items';
  if ((day.uvindex || 0) >= 6) return 'Sun protection is recommended';
  return 'A comfortable day for getting outside';
}

function createOneDayCard(day) {
  const date = createElement(formatDate(day.datetime), 'date-time-day large bold');
  const icon = getWeatherIcon(day.icon);
  const conditionsIcon = createIcon(`wi wi-${icon} forecast-condition-icon`, `${day.datetime}-conditions-icon`);
  const temp = createElement(displayTemperature(day.temp), 'day-temp');
  const tempContainer = createContainer(`${day.datetime}-temp-container`, 'flex-row bold large', conditionsIcon, temp);
  const range = createElement(`H ${displayTemperature(day.tempmax)} · L ${displayTemperature(day.tempmin)}`, 'day-range');
  const cloudIcon = createIcon('wi wi-cloudy forecast-cloud-icon', `${day.datetime}-cloud-icon`)
  const cloudCover = createElement(`${day.cloudcover}%`, 'day-cloudcover');
  const cloudContainer = createContainer(`${day.datetime}-cloud-container`, 'flex-row', cloudIcon, cloudCover);
  const rainIcon = createIcon('wi wi-rain forecast-rain-icon', `${day.datetime}-rain-icon`)
  const rainChances = createElement(`${day.precipprob}%`, 'day-rain-chances');
  const rainContainer = createContainer(`${day.datetime}-rain-container`, 'flex-row', rainIcon, rainChances);
  const windIcon = createIcon('wi wi-windy forecast-wind-icon', `${day.datetime}-wind-icon`);
  const windspeed = createElement(displayWind(day.windspeed), 'day-wind-speed');
  const windContainer = createContainer(`${day.datetime}-wind-container`, 'flex-row', windIcon, windspeed);
  const conditions = createElement(day.conditions, 'day-conditions');
  const advice = createElement(dayAdvice(day), 'day-advice small');
  const card = createContainer(
    `${day.datetime}`,
    'day-card card dark-gray flex-column',
    date,
    tempContainer,
    range,
    cloudContainer,
    rainContainer,
    windContainer,
    conditions,
    advice
  );
  card.setAttribute('role', 'button');
  card.tabIndex = 0;
  card.setAttribute('aria-label', `View full forecast for ${formatDate(day.datetime)}`);
  card.title = 'View full forecast';
  card.addEventListener('click', () => renderForecastDay(day));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      renderForecastDay(day);
    }
  });
  return card;
}

function renderForecastDay(day) {
  const forecastConditions = {
    ...day,
    feelslike: day.temp,
    datetimeEpoch: new Date(`${day.datetime}T12:00:00`).getTime() / 1000,
    precip: day.precip || 0,
    icon: day.icon,
    visibility: day.visibility || 10,
    uvindex: day.uvindex || 0
  };
  renderDay('forecast', forecastConditions, day, day);
  const main = document.querySelector('#main');
  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'forecast-back btn';
  backButton.textContent = `← Back to 12-day outlook · ${formatDate(day.datetime)}`;
  backButton.addEventListener('click', () => renderNext12Days(window.__rainifyDays || []));
  main.prepend(backButton);
}

function renderNext12Days(days) {
  window.__rainifyDays = days;
  const main = document.querySelector('#main');
  main.replaceChildren();
  for (const day of days) {
    const oneDay = createOneDayCard(day);
    main.appendChild(oneDay);
  }
  main.classList.add('days-view');
}

export {renderNext12Days}