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
  const time = hour.datetime.slice(0, 5);
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
  const conditionsIcon = document.createElement('span');
  conditionsIcon.className = 'svg-icon hour-icon';
  conditionsIcon.id = `${hour.datetime}-icon`;
  conditionsIcon.dataset.icon = hour.icon;
  const cloudIcon = document.createElement('span');
  cloudIcon.className = 'svg-icon hour-icon';
  cloudIcon.id = `${hour.datetime}-cloud-icon`;
  cloudIcon.dataset.icon = 'cloudy';
  const windIcon = document.createElement('span');
  windIcon.className = 'svg-icon hour-icon';
  windIcon.id = `${hour.datetime}-wind-icon`;
  windIcon.dataset.icon = 'wind';
  const tempElem = createElement(temp, 'value' );
  const tempContainer = createContainer(`${hour.datetime}-temp-icon`, 'flex-row bold', conditionsIcon,  tempElem);
  const timeElem = createElement(time, 'bold large value');
  const cloudCoverElem = createElement(cloudCover, 'value');
  const cloudContainer = createContainer(`${hour.datetime}-cloud-container`, 'flex-row', cloudIcon, cloudCoverElem);
  const conditionsElem = createElement(conditions, 'value');
  const windspeedElem = createElement(windspeed, 'value');
  const windContainer = createContainer(`${hour.datatime}-wind-container`, 'flex-row', windIcon, windspeedElem);
  const hourContainer  = createContainer( 
    `${time}-hour`, 
    'flex-column card', 
    timeElem, 
    tempContainer, 
    cloudContainer,
    windContainer, 
    conditionsElem
  );
  return hourContainer;
}
function createButton(text, id,classNames, handleClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = classNames;
  btn.id = id;
  btn.textContent = text;
  btn.onclick= (event) => handleClick(event.target);
  return btn;
}
export {
  createContainer, 
  createElement, 
  createLabeledElement, 
  createAnHour, 
  createButton
};