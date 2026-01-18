const currentLocation = {locality: 'Multan', countryName: 'Pakistan'};

const weather = {
  setWeather: function (data) {
    this._current = data.currentConditions || '';
    this._today = data.days[0] || '';
    this._tomorrow = data.days[1] || '';
    this._next12Days = data.days.slice(2, 13) || '';
    this._location = {city: currentLocation.city, country: currentLocation.countryName} || {city: '', country: ''};
  },
  get current() {
    return this._current;
  },
  get today() {
    return this._today;
  },
  get tomorrow () {
    return this._tomorrow;
  },
  get next12Days () {
    return this._next12Days;
  }
}
const units = {
  _temp: '°F',
  _visibility: 'Mi',
  _pressure: 'inHg',
  _speed: 'Mi/h',
  setUnit: function (type) {
    if (type == 'Metric') {
      this._temp = '°C',
      this._visibility = 'Km',
      this._pressure = 'inHg',
      this._speed = 'Km/h'
    }
  },
  get temp () {
    return this._temp;
  },
  get visibility () {
    return this._visibility;
  },
  get pressure () {
    return this._pressure;
  },
  get speed () {
    return this._speed;
  }
}
export {currentLocation, units, weather};