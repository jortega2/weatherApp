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
   * loads today's weather data onto index.html
   */
  function loadToday(weatherData) {
    if (weatherData === null) {
      console.log("no weather data loaded.");
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
  const unit = "F";
  const title = weatherData.name;
  /**
   * Update unit of measurement
   * @param {String} newUnit
   */
  function setUnit(newUnit) {
    unit = newUnit;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O1VDeElBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vQztBQUNRO0FBQ2dCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxlQUFlO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUUsMkRBQWtCO0FBQ3BCLGdDQUFnQyxvRUFBMkI7QUFDM0QsaUNBQWlDLHFFQUE0Qjs7QUFFN0Qsa0JBQWtCLHdEQUFjO0FBQ2hDLG1CQUFtQix5REFBZTtBQUNsQztBQUNBLEVBQUUsZ0VBQXVCO0FBQ3pCLEVBQUUsbUVBQTBCO0FBQzVCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy9hcGlDYWxsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy9lbGVtZW50TG9hZGVyLmpzIiwid2VicGFjazovL3dlYXRoZXJhcHAvLi9zcmMvd2VhdGhlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcGlDYWxsZXIgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCB6aXBSZWdleCA9IC8oXlxcZHs1fSQpLztcbiAgY29uc3QgbG9uZ0xhdFJlZ2V4ID0gLygtP1xcZHsxLDJ9KFxcLlxcZCspPylcXHMoLT9cXGR7MSwyfShcXC5cXGQrKT8pLztcbiAgbGV0IHN5c3RlbSA9IFwiaW1wZXJpYWxcIjtcbiAgbGV0IHVybCA9IG51bGw7XG4gIC8qKlxuICAgKiBwYXJzZXMgdXNlciBpbnB1dCBhbmQgY3JlYXRlcyB0aGUgY29ycmVjdCB1cmwgZm9yIHRoZSBhcGkgY2FsbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0IHVzZXIgaW5wdXQuIGNvdWxkIGJlIHppcGNvZGUsIGNpdHkgbmFtZSwgb3IgbG9uZy9sYXQgY29vcmRzLlxuICAgKi9cbiAgZnVuY3Rpb24gc2V0SW5wdXQoaW5wdXQpIHtcbiAgICBpZiAoemlwUmVnZXgudGVzdChpbnB1dCkpIHtcbiAgICAgIHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj8memlwPSR7aW5wdXR9JnVuaXRzPSR7c3lzdGVtfSZhcHBpZD1hNDE2ZTQ2MTU5YjVlMzVmMzVhZWM1MTg1NTgwNzY2OWA7XG4gICAgfSBlbHNlIGlmIChsb25nTGF0UmVnZXgudGVzdChpbnB1dCkpIHtcbiAgICAgIGNvbnN0IGxvbmdMYXQgPSBpbnB1dC5zcGxpdChcIiBcIik7XG4gICAgICBjb25zdCBsYXQgPSBsb25nTGF0WzBdO1xuICAgICAgY29uc3QgbG9uZyA9IGxvbmdMYXRbMV07XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb25nfSZ1bml0cz0ke3N5c3RlbX0mYXBwaWQ9YTQxNmU0NjE1OWI1ZTM1ZjM1YWVjNTE4NTU4MDc2NjlgO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT0ke2lucHV0fSZ1bml0cz0ke3N5c3RlbX0mYXBwaWQ9YTQxNmU0NjE1OWI1ZTM1ZjM1YWVjNTE4NTU4MDc2NjlgO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogdGFrZXMgYSB1cmwgdG8gbWFrZSBhbiBhcGkgY2FsbCwgcGFyc2VzIGFuZCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIGRhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHRoZSBhcGkgbGluayB0byBmZXRjaCB3ZWF0aGVyIGluZm9ybWF0aW9uIGZyb21cbiAgICogQHJldHVybiB7b2JqZWN0fSBkYXRhIC0gdGhlIGRhdGEgY29udGFpbmluZyB0aGUgd2VhdGhlciBpbmZvcm1hdGlvblxuICAgKi9cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFdlYXRoZXIoKSB7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBhc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyRm9yZWNhc3QoKSB7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9yZWNhc3RVUkwgPSB1cmwucmVwbGFjZShcIndlYXRoZXI/XCIsIFwiZm9yZWNhc3Q/XCIpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmb3JlY2FzdFVSTCk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIHNldHMgdGhlIG1lYXN1cmVtZW50IHN5c3RlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3U3lzdGVtIHN0cmluZyB3aXRoIHRoZSB0eXBlIG9mIG1lYXN1cmVtZW50IHN5c3RlbSB0byB1c2VcbiAgICovXG4gIGZ1bmN0aW9uIHNldFN5c3RlbShuZXdTeXN0ZW0pIHtcbiAgICBpZiAoXG4gICAgICBuZXdTeXN0ZW0udG9Mb3dlckNhc2UoKSAhPSBcImltcGVyaWFsXCIgJiZcbiAgICAgIG5ld1N5c3RlbS50b0xvd2VyQ2FzZSgpICE9IFwibWV0cmljXCJcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3lzdGVtID0gbmV3U3lzdGVtO1xuICB9XG5cbiAgcmV0dXJuIHsgZ2V0Q3VycmVudFdlYXRoZXIsIHNldElucHV0LCBzZXRTeXN0ZW0sIGdldFdlYXRoZXJGb3JlY2FzdCB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpQ2FsbGVyO1xuIiwiY29uc3QgZWxlbWVudExvYWRlciA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIGdldCBodG1sIHRvZGF5IGVsZW1lbnRzXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICBjb25zdCB0b2RheUltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgaW1nXCIpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSAud2VhdGhlclwiKTtcbiAgY29uc3Qgd2VhdGhlckRlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IC5kZXNjcmlwdGlvblwiKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgLnRlbXBcIik7XG4gIGNvbnN0IHRlbXBIaWdoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSAuaGlnaFwiKTtcbiAgY29uc3QgdGVtcExvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgLmxvd1wiKTtcbiAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IC5odW1pZGl0eVwiKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xuXG4gIC8vIGdldCBodG1sIGZvcmVjYXN0IGVsZW1lbnRzXG4gIGNvbnN0IGZvcmVjYXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICBjb25zdCBpbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQgaW1nXCIpO1xuICBjb25zdCBmV2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZCAuY1dlYXRoZXJcIik7XG4gIGNvbnN0IGZUZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkIC5jVGVtcFwiKTtcbiAgY29uc3QgZGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQgLmRhdGVcIik7XG5cbiAgLyoqXG4gICAqIGxvYWRzIHRvZGF5J3Mgd2VhdGhlciBkYXRhIG9udG8gaW5kZXguaHRtbFxuICAgKi9cbiAgZnVuY3Rpb24gbG9hZFRvZGF5KHdlYXRoZXJEYXRhKSB7XG4gICAgaWYgKHdlYXRoZXJEYXRhID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vIHdlYXRoZXIgZGF0YSBsb2FkZWQuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBib2R5LmNsYXNzTGlzdCA9IFwiXCI7XG4gICAgYm9keS5jbGFzc0xpc3QgPSB3ZWF0aGVyRGF0YS5nZXRXZWF0aGVyKCk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB3ZWF0aGVyRGF0YS5nZXRUaXRsZSgpO1xuICAgIHRvZGF5SW1nLnNyYyA9IGAuLi9pbWFnZXMvJHt3ZWF0aGVyRGF0YS5nZXRXZWF0aGVyKCl9LnBuZ2A7XG4gICAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXIoKTtcbiAgICB3ZWF0aGVyRGVzYy50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXJEZXNjKCk7XG4gICAgdGVtcC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFRlbXAoKTtcbiAgICB0ZW1wSGlnaC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldE1heFRlbXAoKTtcbiAgICB0ZW1wTG93LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0TWluVGVtcCgpO1xuICAgIGh1bWlkaXR5LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0SHVtaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsb2FkcyBkYXRhIG9udG8gaHRtbFxuICAgKiBAcGFyYW0ge0FycmF5fSBmb3JlY2FzdERhdGFcbiAgICovXG4gIGZ1bmN0aW9uIGxvYWRGb3JlY2FzdChmb3JlY2FzdERhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcmVjYXN0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yZWNhc3RbaV0uY2xhc3NMaXN0ID0gXCJjYXJkXCI7XG4gICAgICBmb3JlY2FzdFtpXS5jbGFzc0xpc3QuYWRkKGAke2ZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCl9YCk7XG4gICAgICBpbWFnZXNbaV0uc3JjID0gYC4uL2ltYWdlcy8ke2ZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCl9LnBuZ2A7XG4gICAgICBmV2VhdGhlcltpXS50ZXh0Q29udGVudCA9IGZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCk7XG4gICAgICBmVGVtcFtpXS50ZXh0Q29udGVudCA9IGZvcmVjYXN0RGF0YVtpXS5nZXRUZW1wKCk7XG4gICAgICBkYXRlc1tpXS50ZXh0Q29udGVudCA9IGZvcmVjYXN0RGF0YVtpXS5nZXREYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgbG9hZFRvZGF5LCBsb2FkRm9yZWNhc3QgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGVsZW1lbnRMb2FkZXI7XG4iLCIvKipcbiAqIEdldHMgb2JqZWN0IGZyb20gYXBpIGNhbGwgYW5kIGV4dHJhY3RzL29yZ2FuaXplcyBkZXNpcmVkIGRhdGFcbiAqIEBwYXJhbSB7e09iamVjdH19IHdlYXRoZXJEYXRhXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3ZWF0aGVyRmFjdG9yeSh3ZWF0aGVyRGF0YSkge1xuICBjb25zdCBtaW5UZW1wID0gd2VhdGhlckRhdGEubWFpbi50ZW1wX21pbjtcbiAgY29uc3QgbWF4VGVtcCA9IHdlYXRoZXJEYXRhLm1haW4udGVtcF9tYXg7XG4gIGNvbnN0IHRlbXAgPSB3ZWF0aGVyRGF0YS5tYWluLnRlbXA7XG4gIGNvbnN0IGh1bWlkaXR5ID0gd2VhdGhlckRhdGEubWFpbi5odW1pZGl0eTtcbiAgY29uc3QgZmVlbHNMaWtlID0gd2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlO1xuICBjb25zdCB3ZWF0aGVyID0gd2VhdGhlckRhdGEud2VhdGhlclswXS5tYWluO1xuICBjb25zdCB3ZWF0aGVyRGVzYyA9IHdlYXRoZXJEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG4gIGNvbnN0IGRhdGUgPSB3ZWF0aGVyRGF0YS5kdF90eHQ7XG4gIGNvbnN0IHVuaXQgPSBcIkZcIjtcbiAgY29uc3QgdGl0bGUgPSB3ZWF0aGVyRGF0YS5uYW1lO1xuICAvKipcbiAgICogVXBkYXRlIHVuaXQgb2YgbWVhc3VyZW1lbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5ld1VuaXRcbiAgICovXG4gIGZ1bmN0aW9uIHNldFVuaXQobmV3VW5pdCkge1xuICAgIHVuaXQgPSBuZXdVbml0O1xuICB9XG4gIC8qKlxuICAgKiBtaW4gdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfSBtaW5pbXVtIHRlbXBlcmF0dXJlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRNaW5UZW1wKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pblRlbXAgKiAxMCkgLyAxMCArIGDCsCR7dW5pdH1gO1xuICB9XG4gIC8qKlxuICAgKiBtYXggdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0TWF4VGVtcCgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtYXhUZW1wICogMTApIC8gMTAgKyBgwrAke3VuaXR9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiB0ZW1wIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRUZW1wKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRlbXAgKiAxMCkgLyAxMCArIGDCsCR7dW5pdH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIGh1bWlkaXR5IGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRIdW1pZGl0eSgpIHtcbiAgICByZXR1cm4gaHVtaWRpdHk7XG4gIH1cblxuICAvKipcbiAgICogZmVlbHNMaWtlIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGZWVsc0xpa2UoKSB7XG4gICAgcmV0dXJuIGZlZWxzTGlrZTtcbiAgfVxuICAvKipcbiAgICogd2VhdGhlciBnZXR0ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0V2VhdGhlcigpIHtcbiAgICByZXR1cm4gd2VhdGhlcjtcbiAgfVxuICAvKipcbiAgICogd2VhdGhlciBkZXNjIGdldHRlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRXZWF0aGVyRGVzYygpIHtcbiAgICByZXR1cm4gd2VhdGhlckRlc2M7XG4gIH1cbiAgLyoqXG4gICAqIGdldCB3ZWF0aGVyIERhdGVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0RGF0ZSgpIHtcbiAgICBjb25zdCBtb250aCA9IGRhdGUuc2xpY2UoNSwgNyk7XG4gICAgY29uc3QgZGF5ID0gZGF0ZS5zbGljZSg4LCAxMCk7XG4gICAgY29uc3QgZGF0ZXMgPSBbXG4gICAgICBcIkphblwiLFxuICAgICAgXCJGZWJcIixcbiAgICAgIFwiTWFyXCIsXG4gICAgICBcIkFwclwiLFxuICAgICAgXCJNYXlcIixcbiAgICAgIFwiSnVuZVwiLFxuICAgICAgXCJKdWx5XCIsXG4gICAgICBcIkF1Z1wiLFxuICAgICAgXCJTcGV0XCIsXG4gICAgICBcIk9jdFwiLFxuICAgICAgXCJOb3ZcIixcbiAgICAgIFwiRGVjXCIsXG4gICAgXTtcblxuICAgIHJldHVybiBgJHtkYXRlc1tOdW1iZXIobW9udGgpIC0gMV19ICR7ZGF5fWA7XG4gIH1cbiAgLyoqXG4gICAqIGdldCBuYW1lL3RpdGxlIG9mIGxvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldFRpdGxlKCkge1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0TWluVGVtcCxcbiAgICBnZXRNYXhUZW1wLFxuICAgIGdldFRlbXAsXG4gICAgZ2V0SHVtaWRpdHksXG4gICAgZ2V0RmVlbHNMaWtlLFxuICAgIGdldFdlYXRoZXIsXG4gICAgZ2V0V2VhdGhlckRlc2MsXG4gICAgZ2V0RGF0ZSxcbiAgICBzZXRVbml0LFxuICAgIGdldFRpdGxlLFxuICB9O1xufVxuLyoqXG4gKiBjcmVhdGVzIG11bHRpcGxlIHdlYXRoZXIgb2JqZWN0cyBmcm9tIGZvcmVjYXN0IGRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBmb3JlY2FzdERhdGFcbiAqIEByZXR1cm4ge2FycmF5fSBhcnJheSBvZiBvYmplY3RzXG4gKiovXG5leHBvcnQgZnVuY3Rpb24gZm9yZWNhc3RGYWN0b3J5KGZvcmVjYXN0RGF0YSkge1xuICBpZiAoIWZvcmVjYXN0RGF0YS5jb2QgfHwgZm9yZWNhc3REYXRhLmNvZCAhPT0gXCIyMDBcIikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBkYXkxID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbNV0pO1xuICBjb25zdCBkYXkyID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMTNdKTtcbiAgY29uc3QgZGF5MyA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzIxXSk7XG4gIGNvbnN0IGRheTQgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFsyOV0pO1xuICBjb25zdCBkYXk1ID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMzddKTtcblxuICByZXR1cm4gW2RheTEsIGRheTIsIGRheTMsIGRheTQsIGRheTVdO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgYXBpQ2FsbGVyIGZyb20gXCIuL2FwaUNhbGxlclwiO1xuaW1wb3J0IGVsZW1lbnRMb2FkZXIgZnJvbSBcIi4vZWxlbWVudExvYWRlclwiO1xuaW1wb3J0IHsgd2VhdGhlckZhY3RvcnksIGZvcmVjYXN0RmFjdG9yeSB9IGZyb20gXCIuL3dlYXRoZXJcIjtcbi8qKlxuICpcbiAqL1xuY29uc3Qgc2VhcmNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2hGb3JtXCIpO1xuc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgbG9hZFBhZ2UpO1xuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmcvTnVtYmVyfSBpbnB1dFxuICovXG5hc3luYyBmdW5jdGlvbiBsb2FkUGFnZShldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLnZhbHVlO1xuXG4gIGFwaUNhbGxlci5zZXRJbnB1dChpbnB1dCk7XG4gIGNvbnN0IHdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGFwaUNhbGxlci5nZXRDdXJyZW50V2VhdGhlcigpO1xuICBjb25zdCBmb3JlY2FzdFJlc3Bvc25lID0gYXdhaXQgYXBpQ2FsbGVyLmdldFdlYXRoZXJGb3JlY2FzdCgpO1xuXG4gIGNvbnN0IHdlYXRoZXIgPSB3ZWF0aGVyRmFjdG9yeSh3ZWF0aGVyUmVzcG9uc2UpO1xuICBjb25zdCBmb3JlY2FzdCA9IGZvcmVjYXN0RmFjdG9yeShmb3JlY2FzdFJlc3Bvc25lKTtcbiAgY29uc29sZS5sb2cod2VhdGhlclJlc3BvbnNlKTtcbiAgZWxlbWVudExvYWRlci5sb2FkVG9kYXkod2VhdGhlcik7XG4gIGVsZW1lbnRMb2FkZXIubG9hZEZvcmVjYXN0KGZvcmVjYXN0KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==