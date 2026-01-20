import { createContainer, createElement } from './components.js';
import { units } from './utils.js';
import { renderRainChart } from './renderRoot.js';

function createOneDayCard(day) {
  const date = createElement(day.datetime, 'date-time-day bold');
  const temp = createElement(`${day.temp}${units.temp}`, 'day-temp bold large');
  const cloudCover = createElement(`${day.cloudcover}%`, 'day-cloudcover');
  const rainChances = createElement(`${day.precipprob}%`, 'day-rain-chances');
  const windspeed = createElement(`${day.windspeed}${units.temp}`, 'day-wind-speed');
  const conditions = createElement(day.conditions, 'day-conditions');
  const oneDay = createContainer(
    `${day.datetime}`,
    'day-card card flex-column',
    date,
    temp,
    cloudCover,
    rainChances,
    windspeed,
    conditions
  );

  return oneDay;
}
function renderNext12Days(days) {
  const main = document.querySelector('#main');
  console.log (main);
  console.table(days);
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
  renderRainChart(days, '', '', 'next12Days');
}

export {renderNext12Days}