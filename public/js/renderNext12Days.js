import { createContainer, createElement, createIcon } from './components.js';
import {  getWeatherIcon, units } from './utils.js';

function createOneDayCard(day) {
  const date = createElement(day.datetime, 'date-time-day large bold');
  const icon = getWeatherIcon(day.icon);
  const conditionsIcon = createIcon(`wi wi-${icon}`, `${day.datetime}-conditions-icon`);
  const temp = createElement(`${day.temp}${units.temp}`, 'day-temp');
  const tempContainer = createContainer(`${day.datetime}-temp-container`, 'flex-row bold large', conditionsIcon, temp);
  const cloudIcon = createIcon('wi wi-cloudy', `${day.datetime}-cloud-icon`)
  const cloudCover = createElement(`${day.cloudcover}%`, 'day-cloudcover');
  const cloudContainer = createContainer(`${day.datetime}-cloud-container`, 'flex-row', cloudIcon, cloudCover);
  const rainIcon = createIcon('wi wi-rain', `${day.datetime}-rain-icon`)
  const rainChances = createElement(`${day.precipprob}%`, 'day-rain-chances');
  const rainContainer = createContainer(`${day.datetime}-rain-container`, 'flex-row', rainIcon, rainChances);
  const windIcon = createIcon('wi wi-windy', `${day.datetime}-wind-icon`);
  const windspeed = createElement(`${day.windspeed}${units.speed}`, 'day-wind-speed');
  const windContainer = createContainer(`${day.datetime}-wind-container`, 'flex-row', windIcon, windspeed);
  const conditions = createElement(day.conditions, 'day-conditions');
  const oneDay = createContainer(
    `${day.datetime}`,
    'day-card card dark-gray flex-column',
    date,
    tempContainer,
    cloudContainer,
    rainContainer,
    windContainer,
    conditions
  );

  return oneDay;
}

function renderNext12Days(days) {
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

export {renderNext12Days}