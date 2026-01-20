import { createButton, createContainer, createElement, createLabeledElement } from "./components.js";
import { renderDay } from "./renderDay.js";
import { renderNext12Days } from "./renderNext12Days.js";
import { currentLocation, getMoonphaseString, weather } from "./utils.js";
import {fetchWeather} from "./main.js";

const sidbar = document.querySelector('#sidebar');
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
function renderDateTimeAndSun(date, sunrise, sunset){
  const parent = document.querySelector('#date-time-sun');
  const dateElem = createElement(date, 'bold');
  const today = new Date;
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const timeString = `${hours}:${minutes}:${seconds}`;
  const sunriseElem = createLabeledElement('sunrise', 'Sunrise', sunrise);
  const sunsetElem = createLabeledElement('sunset', 'Sunset', sunset);
  const timeElem = createElement(timeString, 'time-box');
  if (!parent) {
    const dateTimeSun = createContainer('date-time-sun', 'flex-column card', dateElem, timeElem, sunriseElem, sunsetElem);
    sidbar.appendChild(dateTimeSun);
  } else {
    parent.replaceChildren();
    parent.append(dateElem, timeElem, sunriseElem, sunsetElem);
  }
}

function renderRainChart(day, hours, currentTime, tab){
let upcomingChances = [];
if (tab === 'next12Days') {
  upcomingChances = day.slice(2, 9);
} else {
  const currentHour = Number(currentTime.slice(0,2));
  for (const hour of hours) {
    const time = Number(hour.datetime.slice(0, 2));
    if (time >= currentHour) {
      upcomingChances.push(hour);
    }
  }
}
const length = upcomingChances.length;
if (length > 7) {
  upcomingChances.splice(7);
} else if (length < 7)  {
  upcomingChances = hours.slice(17, 24);
}

const labels = [];
const dataset = [];
if (tab === 'next12Days') {
  for (const day of upcomingChances) {
    labels.push(day.datetime.slice(8));
    const precipProb = day.precipprob !== null ? day.precipprob : 'UNAVAIL';
    dataset.push(precipProb);
  }
} else {
  for (const hour of upcomingChances) {
    labels.push(hour.datetime.slice(0, 2));
    const precipProb = hour.precipprob !== null ? hour.precipprob : 'UNAVAIL';
    dataset.push(precipProb);
  }
}

const div = document.createElement('div');
const canva = document.createElement('canvas');
canva.width = '100%';
div.id = 'rain-chart';
div.className = 'card';
const ctx = canva.getContext('2d');

new Chart(ctx, {
  type: 'bar',
  data: {
  // Your X-Axis Keys
  labels: labels,
  datasets: [{
    label: 'Rain Chances',
    // Replace these with your 7 actual values
    data: dataset,
    backgroundColor: 'rgb(0, 100, 166)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }]
  },
  options: {
  scales: {
  y: {
    beginAtZero: true,
    // Force the scale to max 100
    max: 100 
    }
  },
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      }
    }
  }
  });
  div.append(canva);
  sidbar.append(div);

}

function renderLunarClanendar(moonphase){
  const parent = document.querySelector('#lunar-calendars');
  const date = new Date
  const islamicDate = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  const chineseDate = new Intl.DateTimeFormat('zh-u-ca-chinese', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  const moonphaseValue = getMoonphaseString(moonphase);
  const moonphaseElem = createElement(moonphaseValue, 'value')
  const isalmicElem = createElement(islamicDate, 'islamic-date value');
  const chineseElem = createElement(chineseDate, 'chinese-date value');

  if (!parent) {
    const lunar = createContainer('lunar-calendars', 'flex-column card', moonphaseElem, isalmicElem, chineseElem);
    sidbar.append(lunar);
  } else {
    parent.replaceChildren();
    parent.append(moonphaseElem, isalmicElem, chineseElem);
  }
    
}

function renderTabs(){
  const todayTab = createButton('Today', 'today-tab', 'nav-btn', handleNavBtn);
  const tomorrowTab = createButton('Tomorrow', 'tomorrow-tab', 'nav-btn', handleNavBtn);
  const next12DaysTab = createButton('Next 12 Days', 'next-12-days', 'nav-btn', handleNavBtn);

  const nav = document.getElementById('nav');
  nav.replaceChildren();
  nav.append(todayTab, tomorrowTab, next12DaysTab);
}

function renderLocation(currentLocation){
  const parent = document.querySelector('#location-container');
  const locationString = `${currentLocation.locality}, ${currentLocation.countryName}`;
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
  sunIcon.className = 'fa-solid fa-sun';
  lightBtn.appendChild(sunIcon);
  const darkBtn = document.createElement('button');
  darkBtn.type = 'button';
  const moonIcon = document.createElement('i');
  moonIcon.className = 'fa-solid fa-moon';
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
  
  // Other stuff like profile button
};

function renderSideBar(weather, tab) {
  renderDateTimeAndSun(weather.today.datetime, weather.today.sunrise, weather.today.sunset);
  setInterval(()=> {
    renderDateTimeAndSun(weather.today.datetime, weather.today.sunrise, weather.today.sunset);
  }, 1000);
  if (tab === 'next12Days') {
      renderRainChart(weather.next12Days, '', '', tab);
  } else if (tab === 'tomorrow') {
      renderRainChart(weather.tomorrow, weather.tomorrow.hours, weather.tomorrow.hours[0].datetime, tab);
  } else {
      renderRainChart(weather.today, weather.today.hours,weather.current.datetime, tab );
  }
  renderLunarClanendar(weather.current.moonphase);
}

function renderRoot(tab, weather) {
  renderHeader(currentLocation);
  renderTabs(tab);
  renderSideBar(weather, tab);
  if (tab === 'today') {
    renderDay('today', weather.current, weather.today);
  } else if (tab === 'tomorrow') {
    renderDay('tomorrow', weather.tomorrow);
  } else if (tab === 'next12Days') {
    renderNext12Days(weather.next12Days);
  } else {
    console.error("Invalid Tab option falling back to Today tab");
    renderDay(weather.current, weather.today);
  }
}

export {renderRoot, renderRainChart};