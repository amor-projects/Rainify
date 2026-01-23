import { createButton, createContainer, createElement, createIcon, createSearchSuggestionBox} from "./components.js";
import { renderDay} from "./renderDay.js";
import { renderNext12Days } from "./renderNext12Days.js";
import { currentLocation, weather, getSearchSuggestions} from "./utils.js";
import {fetchWeather} from "./main.js";

const body = document.querySelector('body');
const header = document.querySelector('#header');
function handleNavBtn(btn) {
  if (btn.id == 'today-tab') {
    renderRoot('today', weather);
  } else if (btn.id == 'tomorrow-tab') {
    renderRoot('tomorrow', weather);
  } else if (btn.id == 'next-12-days') {
    renderRoot('next12Days', weather)
  }
}

function renderTabs(tab){
  const todayTab = createButton('Today', 'today-tab', 'nav-btn', handleNavBtn);
  const tomorrowTab = createButton('Tomorrow', 'tomorrow-tab', 'nav-btn', handleNavBtn);
  const next12DaysTab = createButton('Next 12 Days', 'next-12-days', 'nav-btn', handleNavBtn);
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
  searchBox.replaceChildren();
  if (searchSuggestions !== null) {
  const searchSuggestionsDom = createSearchSuggestionBox(searchSuggestions);
  searchBox.append(searchSuggestionsDom);
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
    setTimeout(() => {
      console.log('Waiting');
    }, 100);
    getSearchSuggestions(event.target.value)
      .then((suggestions) => renderSearchSuggestionBox(suggestions))
      .catch((error) => {
        renderSearchSuggestionBox(['Nothing Here']);
        console.error(error.message);
      });
    if (event.key === 'Enter') {
      event.preventDefault();
      searchBtn.click();
    }
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
function renderToggle(){
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
  lightBtn.classList.add('active-toggle');
  lightBtn.addEventListener('click', () => {
    body.classList.remove('dark-theme');
    if (!lightBtn.classList.contains('active-toggle')) lightBtn.classList.add('active-toggle');
    darkBtn.classList.remove('active-toggle');
  })
  darkBtn.addEventListener('click', () => {
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
function renderHeader(currentLocation){
  // Other Stuff like trace me button
  renderLocation(currentLocation);
  renderSearchBar();
  renderToggle();
  const xProfile = document.querySelector('#profile');
  if (!xProfile) {
    const img = document.createElement('img');
    img.src = '../assets/tanjiro-kamado-red-48.png';
    img.width = '100%';
    img.height = '100%';
    const profile = createContainer('profile', 'profile-pic', img);
    header.append(profile);
  }
};


function renderRoot(tab, weather) {
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