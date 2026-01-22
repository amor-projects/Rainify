import { createButton, createContainer, createElement} from "./components.js";
import { renderDay} from "./renderDay.js";
import { renderNextSixDays } from "./renderNext6Days.js";
import { currentLocation, weather} from "./utils.js";
import {fetchWeather} from "./main.js";

const header = document.querySelector('#header');
function handleNavBtn(btn) {
  if (btn.id == 'today-tab') {
    renderRoot('today', weather);
  } else if (btn.id == 'tomorrow-tab') {
    renderRoot('tomorrow', weather);
  } else if (btn.id == 'next-6-days') {
    renderRoot('next6Days', weather)
  }
}


function renderTabs(tab){
  const todayTab = createButton('Today', 'today-tab', 'nav-btn', handleNavBtn);
  const tomorrowTab = createButton('Tomorrow', 'tomorrow-tab', 'nav-btn', handleNavBtn);
  const nextSixDaysTab = createButton('Next 6 Days', 'next-6-days', 'nav-btn', handleNavBtn);
  if (tab === 'tomorrow') {
    tomorrowTab.classList.add('active-tab');
  } else if (tab === 'next6Days') {
    nextSixDaysTab.classList.add('active-tab');
  } else {
    todayTab.classList.add('active-tab');
  }
  const nav = document.getElementById('nav');
  nav.replaceChildren();
  nav.append(todayTab, tomorrowTab, nextSixDaysTab);
}

function renderLocation(currentLocation){
  const parent = document.querySelector('#location-container');
  const locationString = `${currentLocation.locality}`;
  const locationElem = createElement(locationString, 'xl bold');
  const locationIcon = document.createElement('i');
  locationIcon.className = 'fa-solid fa-map-marker';
  if (!parent) {
    const locationContainer = createContainer('location-container', 'flex-row', locationElem, locationIcon);
    header.appendChild(locationContainer);
  } else {
    parent.replaceChildren();
    parent.append(locationElem, locationIcon);
  }
};
function renderSearchBar(){
  const parent = document.querySelector('#search-bar');
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'search-input ';
  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'search-btn btn';
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fa-solid fa-paper-plane';
  searchBtn.appendChild(searchIcon);
  searchBtn.addEventListener('click', () => {
    const search = document.querySelector('.search-input');
    const value = search.value;
    if (value && value != currentLocation.locality) {
      currentLocation.locality = value;
      currentLocation.countryName = "";
      fetchWeather(currentLocation.locality);
    }
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchBtn.click();
    }
  });
  if (!parent) {
  const searchBar = createContainer('search-bar', 'search-bar flex-row', searchInput, searchBtn);
  header.appendChild(searchBar);
  } else {
    parent.replaceChildren();
    parent.append(searchInput, searchBtn);
  }
}
function renderToggle(){
  const parent = document.querySelector('#toggles');
  
  const lightBtn = document.createElement('button');
  lightBtn.type = 'button';
  const sunIcon = document.createElement('i');
  sunIcon.className = 'wi wi-day';
  lightBtn.appendChild(sunIcon);
  const darkBtn = document.createElement('button');
  darkBtn.type = 'button';
  const moonIcon = document.createElement('i');
  moonIcon.className = 'wi wi-night';
  darkBtn.appendChild(moonIcon);
  darkBtn.className = 'toggle btn';
  lightBtn.className = 'toggle btn';

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
  } else if (tab === 'next6Days') {
    renderNextSixDays(weather.next6Days);
  } else {
    console.error("Invalid Tab option falling back to Today tab");
    renderDay(weather.current, weather.today);
  }
}

export {renderRoot};