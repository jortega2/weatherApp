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
  async function getWeatherForecast() {
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

  return { getCurrentWeather, setInput, setSystem, getWeatherForecast };
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
const elementLoader = (function () {
  // get html today elements
  const body = document.body;
  const today = document.querySelector(".today");
  const todayImg = document.querySelector(".today img");
  const weather = document.querySelector(".today .weather");
  const weatherDesc = document.querySelector(".today .description");
  const temp = document.querySelector(".today .temp");
  const tempHigh = document.querySelector(".today .high");
  const tempLow = document.querySelector(".today .low");
  const humidity = document.querySelector(".today .humidity");
  const title = document.querySelector(".title");

  // get html forecast elements
  const forecast = document.querySelectorAll(".card");
  const images = document.querySelectorAll(".card img");
  const fWeather = document.querySelectorAll(".card .cWeather");
  const fTemp = document.querySelectorAll(".card .cTemp");
  const dates = document.querySelectorAll(".card .date");

  /**
   * load data onto html
   * @param {object}} weatherData
   */
  function loadToday(weatherData) {
    if (weatherData === null) {
      console.log("no weather data loaded.");
      return;
    }
    body.classList = "";
    body.classList = weatherData.getWeather();
    today.classList = "today";
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
   * @param {Array} forecastData array of weather objects
   */
  function loadForecast(forecastData) {
    for (let i = 0; i < forecastData.length; i++) {
      forecast[i].classList = "card";
      forecast[i].classList.add(`${forecastData[i].getWeather()}`);
      images[i].src = `../images/${forecastData[i].getWeather()}.png`;
      fWeather[i].textContent = forecastData[i].getWeather();
      fTemp[i].textContent = forecastData[i].getTemp();
      dates[i].textContent = forecastData[i].getDate();
    }
  }

  return { loadToday, loadForecast };
})();

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
  let unit = "F";
  const title = weatherData.name;
  /**
   * Update unit of measurement
   * @param {String} newUnit
   */
  function setUnit(newUnit) {
    if (newUnit){
      unit = "C";
    }
  }
  /**
   * min temp getter
   * @return {Number} minimum temperature
   */
  function getMinTemp() {
    return Math.round(minTemp * 10) / 10 + `°${unit}`;
  }
  /**
   * max temp getter
   * @return {Number}
   */
  function getMaxTemp() {
    return Math.round(maxTemp * 10) / 10 + `°${unit}`;
  }

  /**
   * temp getter
   * @return {Number}
   */
  function getTemp() {
    return Math.round(temp * 10) / 10 + `°${unit}`;
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
  function getDate() {
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    const dates = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Spet",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${dates[Number(month) - 1]} ${day}`;
  }
  /**
   * get name/title of location
   * @return {string}
   */
  function getTitle() {
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
    getTitle,
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
const search = document.querySelector(".searchForm");
search.addEventListener("submit", loadPage);
/**
 *
 * @param {String/Number} input
 */
async function loadPage(event) {
  event.preventDefault();
  const input = document.getElementById("search").value;
  const unit = document.getElementById('unit').checked;
  if (unit){
    _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].setSystem("metric");
  } else {
    _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].setSystem("imperial");
  }

  let weatherResponse;
  let forecastResponse

  _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].setInput(input);
  try{
    weatherResponse = await _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrentWeather();
    forecastResponse = await _apiCaller__WEBPACK_IMPORTED_MODULE_0__["default"].getWeatherForecast();
  } catch (error){
    console.log(error);
  }
  
  if (weatherResponse.cod !== 200 || forecastResponse.cod !== "200"){
    alert('Location not found');
    return;
  }

  const weather = (0,_weather__WEBPACK_IMPORTED_MODULE_2__.weatherFactory)(weatherResponse);
  weather.setUnit(unit);
  const forecast = (0,_weather__WEBPACK_IMPORTED_MODULE_2__.forecastFactory)(forecastResponse);
  forecast.forEach((weatherObj)=>{
    weatherObj.setUnit(unit);
  })
  
  _elementLoader__WEBPACK_IMPORTED_MODULE_1__["default"].loadToday(weather);
  _elementLoader__WEBPACK_IMPORTED_MODULE_1__["default"].loadForecast(forecast);
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VyxRQUFRO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O1VDMUlBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vQztBQUNRO0FBQ2dCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxlQUFlO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksNERBQW1CO0FBQ3ZCLElBQUk7QUFDSixJQUFJLDREQUFtQjtBQUN2Qjs7QUFFQTtBQUNBOztBQUVBLEVBQUUsMkRBQWtCO0FBQ3BCO0FBQ0EsNEJBQTRCLG9FQUEyQjtBQUN2RCw2QkFBNkIscUVBQTRCO0FBQ3pELElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0Isd0RBQWM7QUFDaEM7QUFDQSxtQkFBbUIseURBQWU7QUFDbEM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEVBQUUsZ0VBQXVCO0FBQ3pCLEVBQUUsbUVBQTBCO0FBQzVCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy9hcGlDYWxsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy9lbGVtZW50TG9hZGVyLmpzIiwid2VicGFjazovL3dlYXRoZXJhcHAvLi9zcmMvd2VhdGhlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcGlDYWxsZXIgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCB6aXBSZWdleCA9IC8oXlxcZHs1fSQpLztcbiAgY29uc3QgbG9uZ0xhdFJlZ2V4ID0gLygtP1xcZHsxLDJ9KFxcLlxcZCspPylcXHMoLT9cXGR7MSwyfShcXC5cXGQrKT8pLztcbiAgbGV0IHN5c3RlbSA9IFwiaW1wZXJpYWxcIjtcbiAgbGV0IHVybCA9IG51bGw7XG4gIC8qKlxuICAgKiBwYXJzZXMgdXNlciBpbnB1dCBhbmQgY3JlYXRlcyB0aGUgY29ycmVjdCB1cmwgZm9yIHRoZSBhcGkgY2FsbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0IHVzZXIgaW5wdXQuIGNvdWxkIGJlIHppcGNvZGUsIGNpdHkgbmFtZSwgb3IgbG9uZy9sYXQgY29vcmRzLlxuICAgKi9cbiAgZnVuY3Rpb24gc2V0SW5wdXQoaW5wdXQpIHtcbiAgICBpZiAoemlwUmVnZXgudGVzdChpbnB1dCkpIHtcbiAgICAgIHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj8memlwPSR7aW5wdXR9JnVuaXRzPSR7c3lzdGVtfSZhcHBpZD1hNDE2ZTQ2MTU5YjVlMzVmMzVhZWM1MTg1NTgwNzY2OWA7XG4gICAgfSBlbHNlIGlmIChsb25nTGF0UmVnZXgudGVzdChpbnB1dCkpIHtcbiAgICAgIGNvbnN0IGxvbmdMYXQgPSBpbnB1dC5zcGxpdChcIiBcIik7XG4gICAgICBjb25zdCBsYXQgPSBsb25nTGF0WzBdO1xuICAgICAgY29uc3QgbG9uZyA9IGxvbmdMYXRbMV07XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb25nfSZ1bml0cz0ke3N5c3RlbX0mYXBwaWQ9YTQxNmU0NjE1OWI1ZTM1ZjM1YWVjNTE4NTU4MDc2NjlgO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT0ke2lucHV0fSZ1bml0cz0ke3N5c3RlbX0mYXBwaWQ9YTQxNmU0NjE1OWI1ZTM1ZjM1YWVjNTE4NTU4MDc2NjlgO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogdGFrZXMgYSB1cmwgdG8gbWFrZSBhbiBhcGkgY2FsbCwgcGFyc2VzIGFuZCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIGRhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHRoZSBhcGkgbGluayB0byBmZXRjaCB3ZWF0aGVyIGluZm9ybWF0aW9uIGZyb21cbiAgICogQHJldHVybiB7b2JqZWN0fSBkYXRhIC0gdGhlIGRhdGEgY29udGFpbmluZyB0aGUgd2VhdGhlciBpbmZvcm1hdGlvblxuICAgKi9cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFdlYXRoZXIoKSB7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBhc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyRm9yZWNhc3QoKSB7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9yZWNhc3RVUkwgPSB1cmwucmVwbGFjZShcIndlYXRoZXI/XCIsIFwiZm9yZWNhc3Q/XCIpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmb3JlY2FzdFVSTCk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIHNldHMgdGhlIG1lYXN1cmVtZW50IHN5c3RlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3U3lzdGVtIHN0cmluZyB3aXRoIHRoZSB0eXBlIG9mIG1lYXN1cmVtZW50IHN5c3RlbSB0byB1c2VcbiAgICovXG4gIGZ1bmN0aW9uIHNldFN5c3RlbShuZXdTeXN0ZW0pIHtcbiAgICBpZiAoXG4gICAgICBuZXdTeXN0ZW0udG9Mb3dlckNhc2UoKSAhPSBcImltcGVyaWFsXCIgJiZcbiAgICAgIG5ld1N5c3RlbS50b0xvd2VyQ2FzZSgpICE9IFwibWV0cmljXCJcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3lzdGVtID0gbmV3U3lzdGVtO1xuICB9XG5cbiAgcmV0dXJuIHsgZ2V0Q3VycmVudFdlYXRoZXIsIHNldElucHV0LCBzZXRTeXN0ZW0sIGdldFdlYXRoZXJGb3JlY2FzdCB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpQ2FsbGVyO1xuIiwiY29uc3QgZWxlbWVudExvYWRlciA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIGdldCBodG1sIHRvZGF5IGVsZW1lbnRzXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICBjb25zdCB0b2RheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXlcIik7XG4gIGNvbnN0IHRvZGF5SW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSBpbWdcIik7XG4gIGNvbnN0IHdlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IC53ZWF0aGVyXCIpO1xuICBjb25zdCB3ZWF0aGVyRGVzYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgLmRlc2NyaXB0aW9uXCIpO1xuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSAudGVtcFwiKTtcbiAgY29uc3QgdGVtcEhpZ2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IC5oaWdoXCIpO1xuICBjb25zdCB0ZW1wTG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSAubG93XCIpO1xuICBjb25zdCBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgLmh1bWlkaXR5XCIpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG5cbiAgLy8gZ2V0IGh0bWwgZm9yZWNhc3QgZWxlbWVudHNcbiAgY29uc3QgZm9yZWNhc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gIGNvbnN0IGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZCBpbWdcIik7XG4gIGNvbnN0IGZXZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkIC5jV2VhdGhlclwiKTtcbiAgY29uc3QgZlRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQgLmNUZW1wXCIpO1xuICBjb25zdCBkYXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZCAuZGF0ZVwiKTtcblxuICAvKipcbiAgICogbG9hZCBkYXRhIG9udG8gaHRtbFxuICAgKiBAcGFyYW0ge29iamVjdH19IHdlYXRoZXJEYXRhXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkVG9kYXkod2VhdGhlckRhdGEpIHtcbiAgICBpZiAod2VhdGhlckRhdGEgPT09IG51bGwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gd2VhdGhlciBkYXRhIGxvYWRlZC5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGJvZHkuY2xhc3NMaXN0ID0gXCJcIjtcbiAgICBib2R5LmNsYXNzTGlzdCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXIoKTtcbiAgICB0b2RheS5jbGFzc0xpc3QgPSBcInRvZGF5XCI7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB3ZWF0aGVyRGF0YS5nZXRUaXRsZSgpO1xuICAgIHRvZGF5SW1nLnNyYyA9IGAuLi9pbWFnZXMvJHt3ZWF0aGVyRGF0YS5nZXRXZWF0aGVyKCl9LnBuZ2A7XG4gICAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXIoKTtcbiAgICB3ZWF0aGVyRGVzYy50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXJEZXNjKCk7XG4gICAgdGVtcC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFRlbXAoKTtcbiAgICB0ZW1wSGlnaC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldE1heFRlbXAoKTtcbiAgICB0ZW1wTG93LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0TWluVGVtcCgpO1xuICAgIGh1bWlkaXR5LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0SHVtaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsb2FkcyBkYXRhIG9udG8gaHRtbFxuICAgKiBAcGFyYW0ge0FycmF5fSBmb3JlY2FzdERhdGEgYXJyYXkgb2Ygd2VhdGhlciBvYmplY3RzXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkRm9yZWNhc3QoZm9yZWNhc3REYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JlY2FzdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvcmVjYXN0W2ldLmNsYXNzTGlzdCA9IFwiY2FyZFwiO1xuICAgICAgZm9yZWNhc3RbaV0uY2xhc3NMaXN0LmFkZChgJHtmb3JlY2FzdERhdGFbaV0uZ2V0V2VhdGhlcigpfWApO1xuICAgICAgaW1hZ2VzW2ldLnNyYyA9IGAuLi9pbWFnZXMvJHtmb3JlY2FzdERhdGFbaV0uZ2V0V2VhdGhlcigpfS5wbmdgO1xuICAgICAgZldlYXRoZXJbaV0udGV4dENvbnRlbnQgPSBmb3JlY2FzdERhdGFbaV0uZ2V0V2VhdGhlcigpO1xuICAgICAgZlRlbXBbaV0udGV4dENvbnRlbnQgPSBmb3JlY2FzdERhdGFbaV0uZ2V0VGVtcCgpO1xuICAgICAgZGF0ZXNbaV0udGV4dENvbnRlbnQgPSBmb3JlY2FzdERhdGFbaV0uZ2V0RGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGxvYWRUb2RheSwgbG9hZEZvcmVjYXN0IH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBlbGVtZW50TG9hZGVyO1xuIiwiLyoqXG4gKiBHZXRzIG9iamVjdCBmcm9tIGFwaSBjYWxsIGFuZCBleHRyYWN0cy9vcmdhbml6ZXMgZGVzaXJlZCBkYXRhXG4gKiBAcGFyYW0ge3tPYmplY3R9fSB3ZWF0aGVyRGF0YVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2VhdGhlckZhY3Rvcnkod2VhdGhlckRhdGEpIHtcbiAgY29uc3QgbWluVGVtcCA9IHdlYXRoZXJEYXRhLm1haW4udGVtcF9taW47XG4gIGNvbnN0IG1heFRlbXAgPSB3ZWF0aGVyRGF0YS5tYWluLnRlbXBfbWF4O1xuICBjb25zdCB0ZW1wID0gd2VhdGhlckRhdGEubWFpbi50ZW1wO1xuICBjb25zdCBodW1pZGl0eSA9IHdlYXRoZXJEYXRhLm1haW4uaHVtaWRpdHk7XG4gIGNvbnN0IGZlZWxzTGlrZSA9IHdlYXRoZXJEYXRhLm1haW4uZmVlbHNfbGlrZTtcbiAgY29uc3Qgd2VhdGhlciA9IHdlYXRoZXJEYXRhLndlYXRoZXJbMF0ubWFpbjtcbiAgY29uc3Qgd2VhdGhlckRlc2MgPSB3ZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xuICBjb25zdCBkYXRlID0gd2VhdGhlckRhdGEuZHRfdHh0O1xuICBsZXQgdW5pdCA9IFwiRlwiO1xuICBjb25zdCB0aXRsZSA9IHdlYXRoZXJEYXRhLm5hbWU7XG4gIC8qKlxuICAgKiBVcGRhdGUgdW5pdCBvZiBtZWFzdXJlbWVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3VW5pdFxuICAgKi9cbiAgZnVuY3Rpb24gc2V0VW5pdChuZXdVbml0KSB7XG4gICAgaWYgKG5ld1VuaXQpe1xuICAgICAgdW5pdCA9IFwiQ1wiO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogbWluIHRlbXAgZ2V0dGVyXG4gICAqIEByZXR1cm4ge051bWJlcn0gbWluaW11bSB0ZW1wZXJhdHVyZVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0TWluVGVtcCgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtaW5UZW1wICogMTApIC8gMTAgKyBgwrAke3VuaXR9YDtcbiAgfVxuICAvKipcbiAgICogbWF4IHRlbXAgZ2V0dGVyXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldE1heFRlbXAoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobWF4VGVtcCAqIDEwKSAvIDEwICsgYMKwJHt1bml0fWA7XG4gIH1cblxuICAvKipcbiAgICogdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VGVtcCgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0ZW1wICogMTApIC8gMTAgKyBgwrAke3VuaXR9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBodW1pZGl0eSBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SHVtaWRpdHkoKSB7XG4gICAgcmV0dXJuIGh1bWlkaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIGZlZWxzTGlrZSBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0RmVlbHNMaWtlKCkge1xuICAgIHJldHVybiBmZWVsc0xpa2U7XG4gIH1cbiAgLyoqXG4gICAqIHdlYXRoZXIgZ2V0dGVyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldFdlYXRoZXIoKSB7XG4gICAgcmV0dXJuIHdlYXRoZXI7XG4gIH1cbiAgLyoqXG4gICAqIHdlYXRoZXIgZGVzYyBnZXR0ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0V2VhdGhlckRlc2MoKSB7XG4gICAgcmV0dXJuIHdlYXRoZXJEZXNjO1xuICB9XG4gIC8qKlxuICAgKiBnZXQgd2VhdGhlciBEYXRlXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldERhdGUoKSB7XG4gICAgY29uc3QgbW9udGggPSBkYXRlLnNsaWNlKDUsIDcpO1xuICAgIGNvbnN0IGRheSA9IGRhdGUuc2xpY2UoOCwgMTApO1xuICAgIGNvbnN0IGRhdGVzID0gW1xuICAgICAgXCJKYW5cIixcbiAgICAgIFwiRmViXCIsXG4gICAgICBcIk1hclwiLFxuICAgICAgXCJBcHJcIixcbiAgICAgIFwiTWF5XCIsXG4gICAgICBcIkp1bmVcIixcbiAgICAgIFwiSnVseVwiLFxuICAgICAgXCJBdWdcIixcbiAgICAgIFwiU3BldFwiLFxuICAgICAgXCJPY3RcIixcbiAgICAgIFwiTm92XCIsXG4gICAgICBcIkRlY1wiLFxuICAgIF07XG5cbiAgICByZXR1cm4gYCR7ZGF0ZXNbTnVtYmVyKG1vbnRoKSAtIDFdfSAke2RheX1gO1xuICB9XG4gIC8qKlxuICAgKiBnZXQgbmFtZS90aXRsZSBvZiBsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gdGl0bGU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldE1pblRlbXAsXG4gICAgZ2V0TWF4VGVtcCxcbiAgICBnZXRUZW1wLFxuICAgIGdldEh1bWlkaXR5LFxuICAgIGdldEZlZWxzTGlrZSxcbiAgICBnZXRXZWF0aGVyLFxuICAgIGdldFdlYXRoZXJEZXNjLFxuICAgIGdldERhdGUsXG4gICAgc2V0VW5pdCxcbiAgICBnZXRUaXRsZSxcbiAgfTtcbn1cbi8qKlxuICogY3JlYXRlcyBtdWx0aXBsZSB3ZWF0aGVyIG9iamVjdHMgZnJvbSBmb3JlY2FzdCBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gZm9yZWNhc3REYXRhXG4gKiBAcmV0dXJuIHthcnJheX0gYXJyYXkgb2Ygb2JqZWN0c1xuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmVjYXN0RmFjdG9yeShmb3JlY2FzdERhdGEpIHtcbiAgaWYgKCFmb3JlY2FzdERhdGEuY29kIHx8IGZvcmVjYXN0RGF0YS5jb2QgIT09IFwiMjAwXCIpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgZGF5MSA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzVdKTtcbiAgY29uc3QgZGF5MiA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzEzXSk7XG4gIGNvbnN0IGRheTMgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFsyMV0pO1xuICBjb25zdCBkYXk0ID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMjldKTtcbiAgY29uc3QgZGF5NSA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzM3XSk7XG5cbiAgcmV0dXJuIFtkYXkxLCBkYXkyLCBkYXkzLCBkYXk0LCBkYXk1XTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGFwaUNhbGxlciBmcm9tIFwiLi9hcGlDYWxsZXJcIjtcbmltcG9ydCBlbGVtZW50TG9hZGVyIGZyb20gXCIuL2VsZW1lbnRMb2FkZXJcIjtcbmltcG9ydCB7IHdlYXRoZXJGYWN0b3J5LCBmb3JlY2FzdEZhY3RvcnkgfSBmcm9tIFwiLi93ZWF0aGVyXCI7XG4vKipcbiAqXG4gKi9cbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoRm9ybVwiKTtcbnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGxvYWRQYWdlKTtcbi8qKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nL051bWJlcn0gaW5wdXRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gbG9hZFBhZ2UoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZTtcbiAgY29uc3QgdW5pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bml0JykuY2hlY2tlZDtcbiAgaWYgKHVuaXQpe1xuICAgIGFwaUNhbGxlci5zZXRTeXN0ZW0oXCJtZXRyaWNcIik7XG4gIH0gZWxzZSB7XG4gICAgYXBpQ2FsbGVyLnNldFN5c3RlbShcImltcGVyaWFsXCIpO1xuICB9XG5cbiAgbGV0IHdlYXRoZXJSZXNwb25zZTtcbiAgbGV0IGZvcmVjYXN0UmVzcG9uc2VcblxuICBhcGlDYWxsZXIuc2V0SW5wdXQoaW5wdXQpO1xuICB0cnl7XG4gICAgd2VhdGhlclJlc3BvbnNlID0gYXdhaXQgYXBpQ2FsbGVyLmdldEN1cnJlbnRXZWF0aGVyKCk7XG4gICAgZm9yZWNhc3RSZXNwb25zZSA9IGF3YWl0IGFwaUNhbGxlci5nZXRXZWF0aGVyRm9yZWNhc3QoKTtcbiAgfSBjYXRjaCAoZXJyb3Ipe1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfVxuICBcbiAgaWYgKHdlYXRoZXJSZXNwb25zZS5jb2QgIT09IDIwMCB8fCBmb3JlY2FzdFJlc3BvbnNlLmNvZCAhPT0gXCIyMDBcIil7XG4gICAgYWxlcnQoJ0xvY2F0aW9uIG5vdCBmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHdlYXRoZXIgPSB3ZWF0aGVyRmFjdG9yeSh3ZWF0aGVyUmVzcG9uc2UpO1xuICB3ZWF0aGVyLnNldFVuaXQodW5pdCk7XG4gIGNvbnN0IGZvcmVjYXN0ID0gZm9yZWNhc3RGYWN0b3J5KGZvcmVjYXN0UmVzcG9uc2UpO1xuICBmb3JlY2FzdC5mb3JFYWNoKCh3ZWF0aGVyT2JqKT0+e1xuICAgIHdlYXRoZXJPYmouc2V0VW5pdCh1bml0KTtcbiAgfSlcbiAgXG4gIGVsZW1lbnRMb2FkZXIubG9hZFRvZGF5KHdlYXRoZXIpO1xuICBlbGVtZW50TG9hZGVyLmxvYWRGb3JlY2FzdChmb3JlY2FzdCk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=