import { createButton, createContainer, createElement, createLabeledElement } from "./components.js";
import { renderToday } from "./renderDay.js";
import { getMoonphaseString, weather } from "./utils.js";

const sidbar = document.querySelector('#sidebar');
function handleNavBtn(btn) {
  if (btn.id == 'today-tab') {
    renderRoot('today', weather);
  } else if (btn.id = 'tomorrow-tab') {
    renderRoot('tomorrow', weather);
  } else if (btn.id = 'next-12-days-tab') {
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

function renderRainChart(today, hours, currentTime){
let upcomingHours = [];
const currentHour = Number(currentTime.slice(0,2));
for (const hour of hours) {
  const time = Number(hour.datetime.slice(0, 2));
  if (time >= currentHour) {
    upcomingHours.push(hour);
  }
}
const length = upcomingHours.length;
if (length > 7) {
  upcomingHours.splice(7);
} else  {
  upcomingHours = hours.slice(17, 24);
}

const labels = [];
const dataset = [];
for (const hour of upcomingHours) {
  labels.push(hour.datetime.slice(0, 2));
  const precipProb = hour.precipprob !== null ? hour.precipprob : today.precipprob;
  dataset.push(precipProb);
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
  const next12DaysTab = createButton('Next 12 Days', 'next-12-days-tab', 'nav-btn', handleNavBtn);

  const nav = document.getElementById('nav');
  nav.replaceChildren();
  nav.append(todayTab, tomorrowTab, next12DaysTab);
};
function renderLocation(){};
function renderSearchBar(){};
function renderToggle(){};
function renderHeader(){
  // Other Stuff like trace me button
  renderLocation();
  renderSearchBar();
  renderToggle();
  // Other stuff like profile button
};

function renderSideBar(weather) {
  renderDateTimeAndSun(weather.today.datetime, weather.today.sunrise, weather.today.sunset);
  setInterval(()=> {
    renderDateTimeAndSun(weather.today.datetime, weather.today.sunrise, weather.today.sunset);
  }, 1000)
  renderRainChart(weather.today, weather.today.hours, weather.current.datetime);
  renderLunarClanendar(weather.current.moonphase);
}

function renderRoot(tab, weather) {
  renderHeader();
  renderTabs(tab);
  renderSideBar(weather);
  if (tab == 'today') {
    renderToday(weather.current, weather.today);
  } else if (tab == 'tomorrow') {
    renderTomorrow(weather.tomorrow);
  } else if (tab = 'next12Days') {
    renderNext12Days(weather.next12Days);
  } else {
    console.error("Invalid Tab option falling back to Today tab");
    renderToday(weather.current, weather.today);
  }
}

export {renderRoot};