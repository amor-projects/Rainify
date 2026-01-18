import { createContainer, createElement, createLabeledElement, createAnHour} from "./components.js";
import { units, toCelsius, MiToKm, createWindDescription, findWindDirection } from "./utils.js";

const main = document.querySelector('#main');

function renderToday (current, today) {
  const main = document.querySelector('#main');
  main.replaceChildren();
  const temp = current.temp;
  const description = today.description;
  const low = today.tempmin;
  const high = today.tempmax;
  const feels = current.feelslike;
  const dew = current.dew || today.dew;
  const humidity = current.humidity !== null ? current.humidity : today.humidity;
  const pressure = current.pressure !== null ? current.pressure : today.pressure;
  const visibility = current.visibility !== null ? current.visibility : today.visibility;
  const uvindex = current.uvindex || 0;
  const cloudCover = current.cloudcover !== null ? current.cloudcover : today.cloudcover;
  const currentWindspeed = current.windspeed;
  const currentWinddir = current.winddir;
  const todayWindspeed = today.windspeed;
  const todayWinddir = today.winddir;
  const hours = today.hours;
  const currentTime = current.datetime;
  // DOM Elements
  renderTempAndDescription(temp, description);
  renderLowHighFeels(low, high, feels);
  renderDewHumidityPressure(dew, humidity, pressure);
  renderVisibilityUvCloudCover(visibility, uvindex, cloudCover);
  renderWindStatus(currentWindspeed, todayWindspeed, currentWinddir, todayWinddir);
  renderNextHours(hours, currentTime);
}

export {renderToday};