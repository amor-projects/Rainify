import { MiToKm, toCelsius, units } from "./utils.js";

function createContainer (id, classNames, ...children) {
  const container = document.createElement('div');
  container.id = id;
  container.className = classNames;
  children.forEach((child) => {
    container.appendChild(child);
  })
  return container;
}

function createElement(value, classNames) {
  const valueELem = document.createElement('p');
  valueELem.textContent = value;
  valueELem.className = classNames;
  return valueELem;
};

function createLabeledElement(id, label, value) {
  const labelElem = createElement(label, 'bold');
  const valueElem = createElement(value, 'value');
  const container = createContainer(id, 'flex-row', labelElem, valueElem);
  return container;
}
function createAnHour (hour) {
  const time = hour.datetime.slice(0, 2);
  let temp = hour.temp;
  if (units.temp == '°C') {
    temp = toCelsius(temp);
  }
  temp = `${temp}${units.temp}`;
  const cloudCover = `${hour.cloudcover}%`;
  let windspeed = hour.windspeed;
  const conditions = hour.conditions;
  if (units.temp == 'Km/h') {
    windspeed = MiToKm(windspeed);
  }
  const timeElem = createElement(time, 'bold large value');
  const tempElem = createElement(temp, 'bold value' );
  const cloudCoverElem = createElement(cloudCover, 'value');
  const conditionsElem = createElement(conditions, 'value');
  const windspeedElem = createElement(windspeed, 'value');

  const hourContainer  = createContainer( 
    `${time}-hour`, 
    'flex-column gap1rem card', 
    timeElem, 
    tempElem, 
    cloudCoverElem, 
    windspeedElem, 
    conditionsElem
  );
  return hourContainer;
}
export {createContainer, createElement, createLabeledElement, createAnHour};