import { createButton, createContainer, createElement, createIcon, createSearchSuggestionBox} from "./components.js";
import { renderDay} from "./renderDay.js";
import { renderNext12Days } from "./renderNext12Days.js";
import { currentLocation, weather, getSearchSuggestions, theme, units, currentTab} from "./utils.js";
import {fetchWeather} from "./main.js";

const body = document.querySelector('body');
const header = document.querySelector('#header');
const main = document.querySelector('#main');

function handleNavBtn(btn, tab) {
  if (btn.id === 'today-tab' && tab !== 'today') {
    main.classList.add('fade-out');
    setTimeout(() => {
      console.log (`Swtiching tabs to today-tab`);
      currentTab.tab = 'today';
      renderRoot(weather);
    }, 500);
  } else if (btn.id === 'tomorrow-tab' && tab !== 'tomorrow') {
    main.classList.add('fade-out');
    setTimeout(() => {
      console.log (`Swtiching tabs to tomrrow-tab`);
      currentTab.tab = 'tomorrow'
      renderRoot(weather);
    }, 500);
  } else if (btn.id === 'next-12-days' && tab !== 'next12Days') {
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
  if (!parent) {
    const locationContainer = createContainer('location-container', 'flex-row', locationElem, locationIcon);
    header.appendChild(locationContainer);
  } else {
    parent.replaceChildren();
    parent.append(locationElem);
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
  searchBtn.innerHTML = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="paper_plane">
      <path id="Vector" d="M10.3078 13.6923L15.1539 8.84619M20.1113 5.88867L16.0207 19.1833C15.6541 20.3747 15.4706 20.9707 15.1544 21.1683C14.8802 21.3396 14.5406 21.3683 14.2419 21.2443C13.8975 21.1014 13.618 20.5433 13.0603 19.428L10.4694 14.2461C10.3809 14.0691 10.3366 13.981 10.2775 13.9043C10.225 13.8363 10.1645 13.7749 10.0965 13.7225C10.0215 13.6647 9.93486 13.6214 9.76577 13.5369L4.57192 10.9399C3.45662 10.3823 2.89892 10.1032 2.75601 9.75879C2.63207 9.4601 2.66033 9.12023 2.83169 8.84597C3.02928 8.52974 3.62523 8.34603 4.81704 7.97932L18.1116 3.88867C19.0486 3.60038 19.5173 3.45635 19.8337 3.57253C20.1094 3.67373 20.3267 3.89084 20.4279 4.16651C20.544 4.48283 20.3999 4.95126 20.1119 5.88729L20.1113 5.88867Z" stroke="#888888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    </svg>`
  searchBtn.addEventListener('click', () => {
    const search = document.querySelector('.search-input');
    const value = search.value;
    if (value && value !== currentLocation.locality) {
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
    if (event.key === 'Escape') {
      searchBox.replaceChildren();
      return;
    }
  });

  let _suggestionTimer = null;
  searchInput.addEventListener('input', (event) => {
    clearTimeout(_suggestionTimer);
    const value = event.target.value;
    if (!value) {
      searchBox.replaceChildren();
      return;
    }
    _suggestionTimer = setTimeout(() => {
      getSearchSuggestions(value)
        .then((suggestions) => renderSearchSuggestionBox(suggestions))
        .catch((error) => {
          renderSearchSuggestionBox(['Nothing Here']);
          console.error(error.message);
        });
    }, 300);
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
  if (theme.mode === 'light') {
    lightBtn.classList.add('active-toggle');
  } else {
    darkBtn.classList.add('active-toggle');
    if (!body.classList.contains('dark-theme')) body.classList.add('dark-theme');
  } 
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
  
}

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
    const profile = createContainer('profile', 'profile-pic', img);
    profile.addEventListener('click', () => {
      window.location.href = 'https://github.com/ZephyrAmmor';
  })
  if (xProfile) xProfile.remove();
  header.append(profile);
}

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
    renderDay('today', weather.current, weather.today);
  }
}

export {renderRoot};