import { createButton, createContainer, createElement, createIcon, createSearchSuggestionBox} from "./components.js";
import { renderDay} from "./renderDay.js";
import { renderNext12Days } from "./renderNext12Days.js";
import { currentLocation, weather, getSearchSuggestions, theme, units, currentTab} from "./utils.js";
import {fetchWeather} from "./main.js";

const body = document.querySelector('body');
const header = document.querySelector('#header');
const main = document.querySelector('#main');

function handleNavBtn(btn, tab) {
  if (btn.id == 'today-tab' && tab !== 'today') {
    main.classList.add('fade-out');
    setTimeout(() => {
      console.log (`Swtiching tabs to today-tab`);
      currentTab.tab = 'today';
      renderRoot(weather);
    }, 500);
  } else if (btn.id == 'tomorrow-tab' && tab !== 'tomorrow') {
    main.classList.add('fade-out');
    setTimeout(() => {
      console.log (`Swtiching tabs to tomrrow-tab`);
      currentTab.tab = 'tomorrow'
      renderRoot(weather);
    }, 500);
  } else if (btn.id == 'next-12-days' && tab !== 'next12Days') {
    main.classList.add('fade-out');
    setTimeout(() => {
      console.log (`Swtiching tabs to next-12-days-tab`);
      currentTab.tab = 'next12Days'
      renderRoot( weather)
    }, 500);
  }
}

function renderTabs(tab){
  const todayTab = createButton('Today', 'today-tab', 'nav-btn', handleNavBtn, tab);
  const tomorrowTab = createButton('Tomorrow', 'tomorrow-tab', 'nav-btn', handleNavBtn, tab);
  const next12DaysTab = createButton('Next 12 Days', 'next-12-days', 'nav-btn', handleNavBtn, tab);
  if (tab === 'tomorrow') {
    tomorrowTab.classList.add('active-tab');
  } else if (tab === 'next12Days') {
    next12DaysTab.classList.add('active-tab');
  } else {
    todayTab.classList.add('active-tab');
  }
  const nav = document.getElementById('nav');
  nav.replaceChildren();
  nav.append(todayTab, tomorrowTab, next12DaysTab);
}

function renderLocation(currentLocation){
  const parent = document.querySelector('#location-container');
  const locationString = `${currentLocation.locality}`;
  const locationElem = createElement(locationString, 'large bold');
  const locationIcon = createIcon('wi wi-small-craft-advisory');
  if (!parent) {
    const locationContainer = createContainer('location-container', 'flex-row', locationElem, locationIcon);
    header.appendChild(locationContainer);
  } else {
    parent.replaceChildren();
    parent.append(locationElem, locationIcon);
  }
}

function renderSearchSuggestionBox(searchSuggestions) {
  const searchBox = document.getElementById('search-box');
  if (searchSuggestions !== null) {
  const searchSuggestionsDom = createSearchSuggestionBox(searchSuggestions);
  if (searchBox) {
    searchBox.replaceChildren();
    searchBox.append(searchSuggestionsDom);
  }
  }
}

function renderSearchBar(){
  const parent = document.querySelector('#search');
  const searchBox = document.createElement('div');
  searchBox.id = 'search-box';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'search-input ';
  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'search-btn btn';
  const searchIcon = createIcon('wi wi-direction-up')
  searchBtn.appendChild(searchIcon);
  searchBtn.addEventListener('click', () => {
    const search = document.querySelector('.search-input');
    const value = search.value;
    if (value && value != currentLocation.locality) {
      searchBox.replaceChildren();
      currentLocation.locality = value;
      currentLocation.countryName = "";
      fetchWeather(currentLocation.locality);
    }
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchBtn.click();
      return;
    }
    getSearchSuggestions(event.target.value)
      .then((suggestions) => renderSearchSuggestionBox(suggestions))
      .catch((error) => {
        renderSearchSuggestionBox(['Nothing Here']);
        console.error(error.message);
      });
  });
  const searchBar = createContainer('search-bar', 'search-bar flex-row', searchInput, searchBtn);
  if (!parent) {
  const search = createContainer('search', 'search flex-column', searchBar, searchBox);
  header.appendChild(search);
  } else {
    parent.replaceChildren();
    parent.append(searchBar, searchBox);
  }
}
function renderToggle(theme){
  const parent = document.querySelector('#toggles');
  
  const lightBtn = document.createElement('button');
  lightBtn.type = 'button';
  const sunIcon = createIcon('wi wi-day-sunny', 'light-toggle');
  lightBtn.appendChild(sunIcon);
  const darkBtn = document.createElement('button');
  darkBtn.type = 'button';
  const moonIcon = createIcon('wi wi-night-clear', 'dark-toggle');
  darkBtn.appendChild(moonIcon);
  darkBtn.className = 'toggle btn';
  lightBtn.className = 'toggle btn';
  theme.mode === 'light' ? lightBtn.classList.add('active-toggle') : darkBtn.classList.add('active-toggle');
  lightBtn.addEventListener('click', () => {
    body.classList.remove('dark-theme');
    theme.mode = 'light';
    if (!lightBtn.classList.contains('active-toggle')) lightBtn.classList.add('active-toggle');
    darkBtn.classList.remove('active-toggle');
  })
  darkBtn.addEventListener('click', () => {
    theme.mode = 'dark';
    if (!body.classList.contains('dark-theme')) body.classList.add('dark-theme');
    if (!darkBtn.classList.contains('active-toggle')) darkBtn.classList.add('active-toggle');
    lightBtn.classList.remove('active-toggle')
  })
  if (!parent) {
    const toggles = createContainer('toggles', 'flex-row', lightBtn, darkBtn);
    header.appendChild(toggles);
  } else {
    parent.replaceChildren();
    parent.append(lightBtn, darkBtn)
  }
  
};

function renderUnitToggle () {
  const parent = document.getElementById('units-toggle');
  const cBtn = document.createElement('button');
  cBtn.type = 'button';
  cBtn.textContent = '°C';
  const fBtn = document.createElement('button');
  fBtn.type = 'button';
  fBtn.textContent = '°F';
  cBtn.className = 'toggle btn';
  fBtn.className = 'toggle btn';
  units.current  === 'metric' ? cBtn.classList.add('active-toggle') : fBtn.classList.add('active-toggle')
  cBtn.addEventListener('click', () => {
    units.setUnit('metric');
    const root = document.getElementById('root');
    if (!root.classList.contains('fade-out-slow')) root.classList.add('fade-out-slow');
    setTimeout(() => {
      root.classList.remove('fade-out-slow');
      renderRoot(weather);
    }, 500);
  })
  fBtn.addEventListener('click', () => {
    units.setUnit('us');
    const root = document.getElementById('root');
    if (!root.classList.contains('fade-out-slow')) root.classList.add('fade-out-slow');
    setTimeout(() => {
      root.classList.remove('fade-out-slow');
      renderRoot(weather);
    }, 500);
  })

  if (!parent) {
    const unitsToggle = createContainer('units-toggle', 'flex-row bold', cBtn, fBtn);
    header.append(unitsToggle);
  } else {
    parent.replaceChildren();
    parent.append(cBtn, fBtn);
  }
}
function renderHeader(currentLocation){
  // Other Stuff like trace me button
  renderLocation(currentLocation);
  renderSearchBar();
  renderToggle(theme);
  renderUnitToggle();
  const xProfile = document.querySelector('#profile');
  const img = document.createElement('img');
    img.src = '../assets/tanjiro-kamado-red-48.png';
    img.width = '100%';
    img.height = '100%';
    const profile = createContainer('profile', 'profile-pic', img);
    profile.addEventListener('click', () => {
      window.location.href = 'https://github.com/ZephyrAmmor';
  })
  if (xProfile) xProfile.remove();
  header.append(profile);
};


function renderRoot(weather) {
  const tab = currentTab.tab;
  const root = document.getElementById('root');
  root.classList.remove('fade-out-slow');
  main.classList.remove('fade-out');
  renderHeader(currentLocation);
  renderTabs(tab);
  if (tab === 'today') {
    renderDay('today', weather.current, weather.today, weather.tomorrow);
  } else if (tab === 'tomorrow') {
    renderDay('tomorrow','','', weather.tomorrow);
  } else if (tab === 'next12Days') {
    renderNext12Days(weather.next12Days);
  } else {
    console.error("Invalid Tab option falling back to Today tab");
    renderDay(weather.current, weather.today);
  }
}

export {renderRoot};