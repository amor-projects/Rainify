import { MiToKm, toCelsius, units, getWeatherIcon, inchTomm, handleSuggestion} from "./utils.js";

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
function createButton(text, id,classNames, handleClick, tab) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = classNames;
  btn.id = id;
  btn.textContent = text;
  btn.onclick= (event) => handleClick(event.target, tab);
  return btn;
}
function createIcon(iconClass, id) {
  const icon = document.createElement('i');
  icon.id = id;
  icon.className = iconClass;
  return icon;
}
function createSearchSuggestionButton(feat) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'suggestion btn';
  btn.textContent = feat;
  btn.onclick = () => handleSuggestion(feat);
  return btn;
}
function createSearchSuggestionBox(features) {
  const featuresDom = [];
  for (const feat of features) {
    const searchSuggestionLine = createSearchSuggestionButton(feat);
    featuresDom.push(searchSuggestionLine);
  }
  const searchSuggestionsBox = createContainer('search-suggestion-box', 'flex-column', ...featuresDom);
  return searchSuggestionsBox;
}

function renderRootSkeleton() {
  const mainContainer = document.getElementById('main');
  const headerContainer = document.getElementById('header');
  // Using innerHTML to save time as this is only a skelton
  const headerSkeletonHTML = `
    <div id="location-container" class="flex-row" style="gap: 10px;">
        <div class="skeleton-loading sk-text" style="width: 120px; height: 1.5rem; margin-bottom: 0;"></div>
        <div class="skeleton-loading sk-icon"></div> 
    </div>

    <div id="search" class="search flex-column">
        <div class="skeleton-loading sk-text" min-height: 2.5rem">
        </div>
    </div>

    <div id="toggles" class="flex-row" style="gap: 8px;">
        <div class="skeleton-loading sk-icon"></div>
        <div class="skeleton-loading sk-icon"></div>
    </div>

    <div id="profile" class="profile-pic">
        <div class="skeleton-loading sk-circle"></div>
    </div>
  `;

  headerContainer.innerHTML = headerSkeletonHTML;
  const createGridCard = (id) => `
    <div id="${id}-container">
      <div class="card flex-column">
        <div class="flex-row gray" style="margin-bottom:10px;">
          <div class="skeleton-loading sk-icon"></div> <div class="skeleton-loading sk-text medium"></div> 
        </div>
      <div class="skeleton-loading sk-text large full"></div> <div class="skeleton-loading sk-text small"></div> </div>
    </div>
  `;

  const createHourCard = () => `
    <div class="flex-column card" style="min-width: 130px; min-height: calc(80px + 6vw) gap">
      <div class="skeleton-loading sk-text medium full"></div>
      <div class='flex-row'>
        <div class="skeleton-loading sk-icon" style="margin-left: 8px 0;"></div>
        <div class="skeleton-loading sk-text small full"></div>
      </div>
     <div class='flex-row'>
        <div class="skeleton-loading sk-icon" style="margin-left: 8px 0;"></div>
        <div class="skeleton-loading sk-text small full"></div>
      </div>
     <div class='flex-row'>
        <div class="skeleton-loading sk-icon" style="margin-left: 8px 0;"></div>
        <div class="skeleton-loading sk-text small full"></div>
      </div>
      <div class="skeleton-loading sk-text small full"></div>
    </div>
  `;

  const skeletonHTML = `
    <div id="temp-and-description" class="flex-column card">
      <div class="flex-row xl bold">
        <div class="skeleton-loading sk-text large"></div>
        <div class="skeleton-loading sk-circle"></div>
      </div>
      <div id="low-high" class="flex-column">
         <div class="skeleton-loading sk-text small"></div>
         <div class="skeleton-loading sk-text small"></div>
      </div>
      <div class="skeleton-loading sk-text medium full" style="margin-top:10px;"></div>
    </div>

    ${createGridCard('Feels')}
    ${createGridCard('Pressure')}
    ${createGridCard('Humidity')}
    ${createGridCard('Visiblity')}
    ${createGridCard('Uv-index')}
    ${createGridCard('Precipitation')}
    ${createGridCard('Wind-status')}
    ${createGridCard('Sun-rise-and-set')}

    <div id="hours-carousel" class="flex-row" style="overflow: hidden; padding: 10px 0;">
      <div id="hours-container" class="flex-row" style="width: 100%;">
        ${Array(10).fill(0).map(() => createHourCard()).join('')}
      </div>
    </div>
  `;

  // 4. Inject into the DOM
  mainContainer.innerHTML = skeletonHTML;
}

export {
  createContainer, 
  createElement, 
  createLabeledElement, 
  createAnHour, 
  createButton,
  createLabeledCard,
  createIcon, 
  createSearchSuggestionBox,
  renderRootSkeleton,
};