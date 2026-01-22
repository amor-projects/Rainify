import { MiToKm, toCelsius, units, getWeatherIcon, inchTomm} from "./utils.js";

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

function createLabeledCard(label, icon, value, classNames, description, child = null) {
  const container = document.createElement('div');
  container.id = `${label}-card`;
  container.className = `${classNames} card flex-column`;
  const labelElem = createElement(label, 'medium');
  const titleCard = createContainer(`${label}-title`, 'flex-row gray', icon, labelElem);
  const valueElem = createElement(value, `${label}-value large`);
  const descriptionElem = createElement(description, 'small');
  child ? container.append(titleCard, valueElem, child, descriptionElem) : container.append(titleCard, valueElem, descriptionElem);
  return container;
}
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
  hour.precip = hour.precip || 0;
  const precip = `${inchTomm(hour.precip)} mm`;
  let windspeed = hour.windspeed;
  const conditions = hour.conditions;
  if (units.temp == 'Km/h') {
    windspeed = MiToKm(windspeed);
  }
  const preciptype = hour.preciptype !== null ? hour.preciptype[0] : 'rain';
  const conditionsIcon = createIcon(`wi ${getWeatherIcon(hour.icon)}`);
  const precipIcon = createIcon(`wi wi-${preciptype}`);
  const windIcon = createIcon('wi wi-windy');
  const tempElem = createElement(temp, 'value' );
  const tempContainer = createContainer(`${hour.datetime}-temp-icon`, 'flex-row bold', conditionsIcon,  tempElem);
  const timeElem = createElement(time, 'bold large value');
  const precipElem = createElement(precip, 'value');
  const precipContainer = createContainer(`${hour.datetime}-precip-container`, 'flex-row', precipIcon, precipElem);
  const conditionsElem = createElement(conditions, 'value');
  const windspeedElem = createElement(`${windspeed}${units.speed}`, 'value');
  const windContainer = createContainer(`${hour.datatime}-wind-container`, 'flex-row', windIcon, windspeedElem);
  const hourContainer  = createContainer( 
    `${time}-hour`, 
    'flex-column card', 
    timeElem, 
    tempContainer, 
    precipContainer,
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
function createIcon(iconClass, id) {
  const icon = document.createElement('i');
  icon.id = id;
  icon.className = iconClass;
  return icon;
}
export {
  createContainer, 
  createElement, 
  createLabeledElement, 
  createAnHour, 
  createButton,
  createLabeledCard,
  createIcon
};