/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apiCaller.js":
/*!**************************!*\
  !*** ./src/apiCaller.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const apiCaller = (function () {
  const zipRegex = /(^\d{5}$)/;
  const longLatRegex = /(-?\d{1,2}(\.\d+)?)\s(-?\d{1,2}(\.\d+)?)/;
  let system = "imperial";
  let url = null;
  /**
   * parses user input and creates the correct url for the api call.
   * @param {string} input user input. could be zipcode, city name, or long/lat coords.
   */
  function setInput(input) {
    if (zipRegex.test(input)) {
      url = `https://api.openweathermap.org/data/2.5/weather?&zip=${input}&units=${system}&appid=a416e46159b5e35f35aec51855807669`;
    } else if (longLatRegex.test(input)) {
      const longLat = input.split(" ");
      const lat = longLat[0];
      const long = longLat[1];
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${system}&appid=a416e46159b5e35f35aec51855807669`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=${system}&appid=a416e46159b5e35f35aec51855807669`;
    }
  }
  /**
   * takes a url to make an api call, parses and returns an object containing data
   * @param {string} url - the api link to fetch weather information from
   * @return {object} data - the data containing the weather information
   */
  async function getCurrentWeather() {
    if (!url) {
      return null;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  /**
   * 
   */
  async function getWeatherForecast(){
    if (!url) {
      return null;
    }
    try {
      const forecastURL = url.replace("weather?", "forecast?");
      const response = await fetch(forecastURL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }
  /**
   * sets the measurement system
   * @param {string} newSystem string with the type of measurement system to use
   */
  function setSystem(newSystem) {
    if (
      newSystem.toLowerCase() != "imperial" &&
      newSystem.toLowerCase() != "metric"
    ) {
      return;
    }
    system = newSystem;
  }

  return { getCurrentWeather, setInput, setSystem, getWeatherForecast};
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiCaller);


/***/ }),

/***/ "./src/elementLoader.js":
/*!******************************!*\
  !*** ./src/elementLoader.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const elementLoader = function(){
  // get html today elements
  const body = document.body;
  const todayImg = document.querySelector('.today img');
  const weather = document.querySelector('.today .weather');
  const weatherDesc = document.querySelector('.today .description');
  const temp = document.querySelector('.today .temp');
  const tempHigh = document.querySelector('.today .high');
  const tempLow = document.querySelector('.today .low');
  const humidity = document.querySelector('.today .humidity');
  const title = document.querySelector('.title');

  // get html forecast elements
  const forecast = document.querySelectorAll('.card');
  const images = document.querySelectorAll('.card img');
  const fWeather = document.querySelectorAll('.card .cWeather');
  const fTemp = document.querySelectorAll('.card .cTemp');
  const dates = document.querySelectorAll('.card .date');

  /**
   * loads today's weather data onto index.html
   */
  function loadToday(weatherData){
    if (weatherData === null){
      console.log('no weather data loaded.');
      return;
    }
    body.classList = "";
    body.classList = weatherData.getWeather();
    title.textContent = weatherData.getTitle();
    todayImg.src = `../images/${weatherData.getWeather()}.png`;
    weather.textContent = weatherData.getWeather();
    weatherDesc.textContent = weatherData.getWeatherDesc();
    temp.textContent = weatherData.getTemp();
    tempHigh.textContent = weatherData.getMaxTemp();
    tempLow.textContent = weatherData.getMinTemp();
    humidity.textContent = weatherData.getHumidity();
  }

  /**
   * loads data onto html
   * @param {Array} forecastData 
   */
  function loadForecast(forecastData){
    for (let i  = 0; i < forecastData.length; i++){
      forecast[i].classList = "card";
      forecast[i].classList.add(`${forecastData[i].getWeather()}`)
      images[i].src = `../images/${forecastData[i].getWeather()}.png`;
      fWeather[i].textContent = forecastData[i].getWeather();
      fTemp[i].textContent = forecastData[i].getTemp();
      dates[i].textContent = forecastData[i].getDate();
    }
  }

  return {loadToday, loadForecast}
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (elementLoader);

/***/ }),

/***/ "./src/weather.js":
/*!************************!*\
  !*** ./src/weather.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "forecastFactory": () => (/* binding */ forecastFactory),
/* harmony export */   "weatherFactory": () => (/* binding */ weatherFactory)
/* harmony export */ });
/**
 * Gets object from api call and extracts/organizes desired data
 * @param {{Object}} weatherData
 * @return {Object}
 */
function weatherFactory(weatherData) {
  const minTemp = weatherData.main.temp_min;
  const maxTemp = weatherData.main.temp_max;
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const feelsLike = weatherData.main.feels_like;
  const weather = weatherData.weather[0].main;
  const weatherDesc = weatherData.weather[0].description;
  const date = weatherData.dt_txt;
  const unit = 'F';
  const title = weatherData.name;
  /**
   * Update unit of measurement
   * @param {String} newUnit 
   */
  function setUnit(newUnit){
    unit = newUnit;
  }
  /**
   * min temp getter
   * @return {Number} minimum temperature
   */
  function getMinTemp() {
    return Math.round(minTemp*10)/10 + `°${unit}`;
  }
  /**
   * max temp getter
   * @return {Number}
   */
  function getMaxTemp() {
    return Math.round(maxTemp*10)/10 + `°${unit}`;
  }

  /**
   * temp getter
   * @return {Number}
   */
  function getTemp() {
    return Math.round(temp*10)/10 + `°${unit}`;
  }

  /**
   * humidity getter
   * @return {Number}
   */
  function getHumidity() {
    return humidity;
  }

  /**
   * feelsLike getter
   * @return {Number}
   */
  function getFeelsLike() {
    return feelsLike;
  }
  /**
   * weather getter
   * @return {String}
   */
  function getWeather() {
    return weather;
  }
  /**
   * weather desc getter
   * @return {String}
   */
  function getWeatherDesc() {
    return weatherDesc;
  }
  /**
   * get weather Date
   * @return {String}
   */
  function getDate(){
    return date.slice(5,10);
  }
  /**
   * get name/title of location
   * @return {string}
   */
  function getTitle(){
    return title;
  }

  return {
    getMinTemp,
    getMaxTemp,
    getTemp,
    getHumidity,
    getFeelsLike,
    getWeather,
    getWeatherDesc,
    getDate,
    setUnit,
    getTitle
  };
}
/**
 * creates multiple weather objects from forecast data
 * @param {object} forecastData
 * @return {array} array of objects
 **/
function forecastFactory(forecastData) {
  if (!forecastData.cod || forecastData.cod !== "200") {
    return [];
  }
  const day1 = weatherFactory(forecastData.list[5]);
  const day2 = weatherFactory(forecastData.list[13]);
  const day3 = weatherFactory(forecastData.list[21]);
  const day4 = weatherFactory(forecastData.list[29]);
  const day5 = weatherFactory(forecastData.list[37]);

  return [day1, day2, day3, day4, day5];
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _apiCaller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiCaller */ "./src/apiCaller.js");
/* harmony import */ var _elementLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elementLoader */ "./src/elementLoader.js");
/* harmony import */ var _weather__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./weather */ "./src/weather.js");



/**
 *
 */
const search = document.querySelector('.searchForm');
search.addEventListener('submit', loadPage);
/**
 * 
 * @param {String/Number} input 
 */
async function loadPage(event){
  event.preventDefault();
  const input = document.getElementById('search').value;

  _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].setInput(input);
  const weatherResponse = await _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrentWeather();
  const forecastResposne = await _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].getWeatherForecast();
  
  const weather = (0,_weather__WEBPACK_IMPORTED_MODULE_2__.weatherFactory)(weatherResponse);
  const forecast = (0,_weather__WEBPACK_IMPORTED_MODULE_2__.forecastFactory)(forecastResposne);
  console.log(weatherResponse);
  _elementLoader__WEBPACK_IMPORTED_MODULE_1__["default"].loadToday(weather);
  _elementLoader__WEBPACK_IMPORTED_MODULE_1__["default"].loadForecast(forecast);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOb0M7QUFDUTtBQUNnQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZUFBZTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFFLDJEQUFrQjtBQUNwQixnQ0FBZ0Msb0VBQTJCO0FBQzNELGlDQUFpQyxxRUFBNEI7QUFDN0Q7QUFDQSxrQkFBa0Isd0RBQWM7QUFDaEMsbUJBQW1CLHlEQUFlO0FBQ2xDO0FBQ0EsRUFBRSxnRUFBdUI7QUFDekIsRUFBRSxtRUFBMEI7QUFDNUIsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXJhcHAvLi9zcmMvYXBpQ2FsbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXJhcHAvLi9zcmMvZWxlbWVudExvYWRlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL3dlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXJhcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBpQ2FsbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgemlwUmVnZXggPSAvKF5cXGR7NX0kKS87XG4gIGNvbnN0IGxvbmdMYXRSZWdleCA9IC8oLT9cXGR7MSwyfShcXC5cXGQrKT8pXFxzKC0/XFxkezEsMn0oXFwuXFxkKyk/KS87XG4gIGxldCBzeXN0ZW0gPSBcImltcGVyaWFsXCI7XG4gIGxldCB1cmwgPSBudWxsO1xuICAvKipcbiAgICogcGFyc2VzIHVzZXIgaW5wdXQgYW5kIGNyZWF0ZXMgdGhlIGNvcnJlY3QgdXJsIGZvciB0aGUgYXBpIGNhbGwuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dCB1c2VyIGlucHV0LiBjb3VsZCBiZSB6aXBjb2RlLCBjaXR5IG5hbWUsIG9yIGxvbmcvbGF0IGNvb3Jkcy5cbiAgICovXG4gIGZ1bmN0aW9uIHNldElucHV0KGlucHV0KSB7XG4gICAgaWYgKHppcFJlZ2V4LnRlc3QoaW5wdXQpKSB7XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/JnppcD0ke2lucHV0fSZ1bml0cz0ke3N5c3RlbX0mYXBwaWQ9YTQxNmU0NjE1OWI1ZTM1ZjM1YWVjNTE4NTU4MDc2NjlgO1xuICAgIH0gZWxzZSBpZiAobG9uZ0xhdFJlZ2V4LnRlc3QoaW5wdXQpKSB7XG4gICAgICBjb25zdCBsb25nTGF0ID0gaW5wdXQuc3BsaXQoXCIgXCIpO1xuICAgICAgY29uc3QgbGF0ID0gbG9uZ0xhdFswXTtcbiAgICAgIGNvbnN0IGxvbmcgPSBsb25nTGF0WzFdO1xuICAgICAgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9uZ30mdW5pdHM9JHtzeXN0ZW19JmFwcGlkPWE0MTZlNDYxNTliNWUzNWYzNWFlYzUxODU1ODA3NjY5YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3E9JHtpbnB1dH0mdW5pdHM9JHtzeXN0ZW19JmFwcGlkPWE0MTZlNDYxNTliNWUzNWYzNWFlYzUxODU1ODA3NjY5YDtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIHRha2VzIGEgdXJsIHRvIG1ha2UgYW4gYXBpIGNhbGwsIHBhcnNlcyBhbmQgcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyBkYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSB0aGUgYXBpIGxpbmsgdG8gZmV0Y2ggd2VhdGhlciBpbmZvcm1hdGlvbiBmcm9tXG4gICAqIEByZXR1cm4ge29iamVjdH0gZGF0YSAtIHRoZSBkYXRhIGNvbnRhaW5pbmcgdGhlIHdlYXRoZXIgaW5mb3JtYXRpb25cbiAgICovXG4gIGFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKCkge1xuICAgIGlmICghdXJsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIGFzeW5jIGZ1bmN0aW9uIGdldFdlYXRoZXJGb3JlY2FzdCgpe1xuICAgIGlmICghdXJsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcmVjYXN0VVJMID0gdXJsLnJlcGxhY2UoXCJ3ZWF0aGVyP1wiLCBcImZvcmVjYXN0P1wiKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZm9yZWNhc3RVUkwpO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBzZXRzIHRoZSBtZWFzdXJlbWVudCBzeXN0ZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5ld1N5c3RlbSBzdHJpbmcgd2l0aCB0aGUgdHlwZSBvZiBtZWFzdXJlbWVudCBzeXN0ZW0gdG8gdXNlXG4gICAqL1xuICBmdW5jdGlvbiBzZXRTeXN0ZW0obmV3U3lzdGVtKSB7XG4gICAgaWYgKFxuICAgICAgbmV3U3lzdGVtLnRvTG93ZXJDYXNlKCkgIT0gXCJpbXBlcmlhbFwiICYmXG4gICAgICBuZXdTeXN0ZW0udG9Mb3dlckNhc2UoKSAhPSBcIm1ldHJpY1wiXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN5c3RlbSA9IG5ld1N5c3RlbTtcbiAgfVxuXG4gIHJldHVybiB7IGdldEN1cnJlbnRXZWF0aGVyLCBzZXRJbnB1dCwgc2V0U3lzdGVtLCBnZXRXZWF0aGVyRm9yZWNhc3R9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpQ2FsbGVyO1xuIiwiY29uc3QgZWxlbWVudExvYWRlciA9IGZ1bmN0aW9uKCl7XG4gIC8vIGdldCBodG1sIHRvZGF5IGVsZW1lbnRzXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICBjb25zdCB0b2RheUltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RheSBpbWcnKTtcbiAgY29uc3Qgd2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RheSAud2VhdGhlcicpO1xuICBjb25zdCB3ZWF0aGVyRGVzYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RheSAuZGVzY3JpcHRpb24nKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RheSAudGVtcCcpO1xuICBjb25zdCB0ZW1wSGlnaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RheSAuaGlnaCcpO1xuICBjb25zdCB0ZW1wTG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvZGF5IC5sb3cnKTtcbiAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kYXkgLmh1bWlkaXR5Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG5cbiAgLy8gZ2V0IGh0bWwgZm9yZWNhc3QgZWxlbWVudHNcbiAgY29uc3QgZm9yZWNhc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZCcpO1xuICBjb25zdCBpbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZCBpbWcnKTtcbiAgY29uc3QgZldlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZCAuY1dlYXRoZXInKTtcbiAgY29uc3QgZlRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZCAuY1RlbXAnKTtcbiAgY29uc3QgZGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZCAuZGF0ZScpO1xuXG4gIC8qKlxuICAgKiBsb2FkcyB0b2RheSdzIHdlYXRoZXIgZGF0YSBvbnRvIGluZGV4Lmh0bWxcbiAgICovXG4gIGZ1bmN0aW9uIGxvYWRUb2RheSh3ZWF0aGVyRGF0YSl7XG4gICAgaWYgKHdlYXRoZXJEYXRhID09PSBudWxsKXtcbiAgICAgIGNvbnNvbGUubG9nKCdubyB3ZWF0aGVyIGRhdGEgbG9hZGVkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBib2R5LmNsYXNzTGlzdCA9IFwiXCI7XG4gICAgYm9keS5jbGFzc0xpc3QgPSB3ZWF0aGVyRGF0YS5nZXRXZWF0aGVyKCk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB3ZWF0aGVyRGF0YS5nZXRUaXRsZSgpO1xuICAgIHRvZGF5SW1nLnNyYyA9IGAuLi9pbWFnZXMvJHt3ZWF0aGVyRGF0YS5nZXRXZWF0aGVyKCl9LnBuZ2A7XG4gICAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXIoKTtcbiAgICB3ZWF0aGVyRGVzYy50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXJEZXNjKCk7XG4gICAgdGVtcC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFRlbXAoKTtcbiAgICB0ZW1wSGlnaC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldE1heFRlbXAoKTtcbiAgICB0ZW1wTG93LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0TWluVGVtcCgpO1xuICAgIGh1bWlkaXR5LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0SHVtaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsb2FkcyBkYXRhIG9udG8gaHRtbFxuICAgKiBAcGFyYW0ge0FycmF5fSBmb3JlY2FzdERhdGEgXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkRm9yZWNhc3QoZm9yZWNhc3REYXRhKXtcbiAgICBmb3IgKGxldCBpICA9IDA7IGkgPCBmb3JlY2FzdERhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgZm9yZWNhc3RbaV0uY2xhc3NMaXN0ID0gXCJjYXJkXCI7XG4gICAgICBmb3JlY2FzdFtpXS5jbGFzc0xpc3QuYWRkKGAke2ZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCl9YClcbiAgICAgIGltYWdlc1tpXS5zcmMgPSBgLi4vaW1hZ2VzLyR7Zm9yZWNhc3REYXRhW2ldLmdldFdlYXRoZXIoKX0ucG5nYDtcbiAgICAgIGZXZWF0aGVyW2ldLnRleHRDb250ZW50ID0gZm9yZWNhc3REYXRhW2ldLmdldFdlYXRoZXIoKTtcbiAgICAgIGZUZW1wW2ldLnRleHRDb250ZW50ID0gZm9yZWNhc3REYXRhW2ldLmdldFRlbXAoKTtcbiAgICAgIGRhdGVzW2ldLnRleHRDb250ZW50ID0gZm9yZWNhc3REYXRhW2ldLmdldERhdGUoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge2xvYWRUb2RheSwgbG9hZEZvcmVjYXN0fVxufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBlbGVtZW50TG9hZGVyOyIsIi8qKlxuICogR2V0cyBvYmplY3QgZnJvbSBhcGkgY2FsbCBhbmQgZXh0cmFjdHMvb3JnYW5pemVzIGRlc2lyZWQgZGF0YVxuICogQHBhcmFtIHt7T2JqZWN0fX0gd2VhdGhlckRhdGFcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdlYXRoZXJGYWN0b3J5KHdlYXRoZXJEYXRhKSB7XG4gIGNvbnN0IG1pblRlbXAgPSB3ZWF0aGVyRGF0YS5tYWluLnRlbXBfbWluO1xuICBjb25zdCBtYXhUZW1wID0gd2VhdGhlckRhdGEubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcCA9IHdlYXRoZXJEYXRhLm1haW4udGVtcDtcbiAgY29uc3QgaHVtaWRpdHkgPSB3ZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5O1xuICBjb25zdCBmZWVsc0xpa2UgPSB3ZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHdlYXRoZXIgPSB3ZWF0aGVyRGF0YS53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJEZXNjID0gd2VhdGhlckRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbjtcbiAgY29uc3QgZGF0ZSA9IHdlYXRoZXJEYXRhLmR0X3R4dDtcbiAgY29uc3QgdW5pdCA9ICdGJztcbiAgY29uc3QgdGl0bGUgPSB3ZWF0aGVyRGF0YS5uYW1lO1xuICAvKipcbiAgICogVXBkYXRlIHVuaXQgb2YgbWVhc3VyZW1lbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5ld1VuaXQgXG4gICAqL1xuICBmdW5jdGlvbiBzZXRVbml0KG5ld1VuaXQpe1xuICAgIHVuaXQgPSBuZXdVbml0O1xuICB9XG4gIC8qKlxuICAgKiBtaW4gdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfSBtaW5pbXVtIHRlbXBlcmF0dXJlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRNaW5UZW1wKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pblRlbXAqMTApLzEwICsgYMKwJHt1bml0fWA7XG4gIH1cbiAgLyoqXG4gICAqIG1heCB0ZW1wIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRNYXhUZW1wKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1heFRlbXAqMTApLzEwICsgYMKwJHt1bml0fWA7XG4gIH1cblxuICAvKipcbiAgICogdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VGVtcCgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0ZW1wKjEwKS8xMCArIGDCsCR7dW5pdH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIGh1bWlkaXR5IGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRIdW1pZGl0eSgpIHtcbiAgICByZXR1cm4gaHVtaWRpdHk7XG4gIH1cblxuICAvKipcbiAgICogZmVlbHNMaWtlIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGZWVsc0xpa2UoKSB7XG4gICAgcmV0dXJuIGZlZWxzTGlrZTtcbiAgfVxuICAvKipcbiAgICogd2VhdGhlciBnZXR0ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0V2VhdGhlcigpIHtcbiAgICByZXR1cm4gd2VhdGhlcjtcbiAgfVxuICAvKipcbiAgICogd2VhdGhlciBkZXNjIGdldHRlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRXZWF0aGVyRGVzYygpIHtcbiAgICByZXR1cm4gd2VhdGhlckRlc2M7XG4gIH1cbiAgLyoqXG4gICAqIGdldCB3ZWF0aGVyIERhdGVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0RGF0ZSgpe1xuICAgIHJldHVybiBkYXRlLnNsaWNlKDUsMTApO1xuICB9XG4gIC8qKlxuICAgKiBnZXQgbmFtZS90aXRsZSBvZiBsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRUaXRsZSgpe1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0TWluVGVtcCxcbiAgICBnZXRNYXhUZW1wLFxuICAgIGdldFRlbXAsXG4gICAgZ2V0SHVtaWRpdHksXG4gICAgZ2V0RmVlbHNMaWtlLFxuICAgIGdldFdlYXRoZXIsXG4gICAgZ2V0V2VhdGhlckRlc2MsXG4gICAgZ2V0RGF0ZSxcbiAgICBzZXRVbml0LFxuICAgIGdldFRpdGxlXG4gIH07XG59XG4vKipcbiAqIGNyZWF0ZXMgbXVsdGlwbGUgd2VhdGhlciBvYmplY3RzIGZyb20gZm9yZWNhc3QgZGF0YVxuICogQHBhcmFtIHtvYmplY3R9IGZvcmVjYXN0RGF0YVxuICogQHJldHVybiB7YXJyYXl9IGFycmF5IG9mIG9iamVjdHNcbiAqKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JlY2FzdEZhY3RvcnkoZm9yZWNhc3REYXRhKSB7XG4gIGlmICghZm9yZWNhc3REYXRhLmNvZCB8fCBmb3JlY2FzdERhdGEuY29kICE9PSBcIjIwMFwiKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGNvbnN0IGRheTEgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFs1XSk7XG4gIGNvbnN0IGRheTIgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFsxM10pO1xuICBjb25zdCBkYXkzID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMjFdKTtcbiAgY29uc3QgZGF5NCA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzI5XSk7XG4gIGNvbnN0IGRheTUgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFszN10pO1xuXG4gIHJldHVybiBbZGF5MSwgZGF5MiwgZGF5MywgZGF5NCwgZGF5NV07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBhcGlDYWxsZXIgZnJvbSAnLi9hcGlDYWxsZXInO1xuaW1wb3J0IGVsZW1lbnRMb2FkZXIgZnJvbSAnLi9lbGVtZW50TG9hZGVyJztcbmltcG9ydCB7IHdlYXRoZXJGYWN0b3J5LCBmb3JlY2FzdEZhY3RvcnkgfSBmcm9tICcuL3dlYXRoZXInO1xuLyoqXG4gKlxuICovXG5jb25zdCBzZWFyY2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoRm9ybScpO1xuc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGxvYWRQYWdlKTtcbi8qKlxuICogXG4gKiBAcGFyYW0ge1N0cmluZy9OdW1iZXJ9IGlucHV0IFxuICovXG5hc3luYyBmdW5jdGlvbiBsb2FkUGFnZShldmVudCl7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaCcpLnZhbHVlO1xuXG4gIGFwaUNhbGxlci5zZXRJbnB1dChpbnB1dCk7XG4gIGNvbnN0IHdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGFwaUNhbGxlci5nZXRDdXJyZW50V2VhdGhlcigpO1xuICBjb25zdCBmb3JlY2FzdFJlc3Bvc25lID0gYXdhaXQgYXBpQ2FsbGVyLmdldFdlYXRoZXJGb3JlY2FzdCgpO1xuICBcbiAgY29uc3Qgd2VhdGhlciA9IHdlYXRoZXJGYWN0b3J5KHdlYXRoZXJSZXNwb25zZSk7XG4gIGNvbnN0IGZvcmVjYXN0ID0gZm9yZWNhc3RGYWN0b3J5KGZvcmVjYXN0UmVzcG9zbmUpO1xuICBjb25zb2xlLmxvZyh3ZWF0aGVyUmVzcG9uc2UpO1xuICBlbGVtZW50TG9hZGVyLmxvYWRUb2RheSh3ZWF0aGVyKTtcbiAgZWxlbWVudExvYWRlci5sb2FkRm9yZWNhc3QoZm9yZWNhc3QpO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==