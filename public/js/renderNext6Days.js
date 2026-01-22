import { createContainer, createElement } from './components.js';
import {  units } from './utils.js';

function createOneDayCard(day) {
  const date = createElement(day.datetime, 'date-time-day large bold');

  const conditionsIcon = document.createElement('span');
  conditionsIcon.className = 'day-icon svg-icon';
  conditionsIcon.dataset.icon = day.icon;
  conditionsIcon.id = `${day.datetime}-day-icon`
  const temp = createElement(`${day.temp}${units.temp}`, 'day-temp');
  const tempContainer = createContainer(`${day.datetime}-temp-container`, 'flex-row bold large', conditionsIcon, temp);

  const cloudIcon = document.createElement('span');
  cloudIcon.className = 'day-icon svg-icon';
  cloudIcon.dataset.icon = 'cloud';
  cloudIcon.id = `${day.datetime}-cloud-icon`;
  const cloudCover = createElement(`${day.cloudcover}%`, 'day-cloudcover');
  const cloudContainer = createContainer(`${day.datetime}-cloud-container`, 'flex-row', cloudIcon, cloudCover);

  const rainIcon = document.createElement('sapn');
  rainIcon.className = 'day-icon svg-icon';
  rainIcon.dataset.icon = 'rain';
  rainIcon.id = `${day.datetime}-rain-icon`;
  const rainChances = createElement(`${day.precipprob}%`, 'day-rain-chances');
  const rainContainer = createContainer(`${day.datetime}-rain-container`, 'flex-row', rainIcon, rainChances);

  const windIcon = document.createElement('span');
  windIcon.className = 'svg-icon day-icon';
  windIcon.id = `${day.datetime}-wind-icon`;
  windIcon.dataset.icon = 'wind';
  const windspeed = createElement(`${day.windspeed}${units.speed}`, 'day-wind-speed');
  const windContainer = createContainer(`${day.datetime}-wind-container`, 'flex-row', windIcon, windspeed);

  const conditions = createElement(day.conditions, 'day-conditions');
  const oneDay = createContainer(
    `${day.datetime}`,
    'day-card card flex-column',
    date,
    tempContainer,
    cloudContainer,
    rainContainer,
    windContainer,
    conditions
  );

  return oneDay;
}

function renderNextSixDays(days) {
  const main = document.querySelector('#main');
  main.replaceChildren();
  for (const day of days) {
    const oneDay = createOneDayCard(day);
    main.appendChild(oneDay);
  }
  main.classList.add('days-view');
  const rainChart = document.querySelector('#rain-chart');
  if (rainChart) {
    rainChart.remove();
  };
}

export {renderNextSixDays}