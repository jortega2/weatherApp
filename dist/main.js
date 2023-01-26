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
  /**
   * min temp getter
   * @return {Number} minimum temperature
   */
  function getMinTemp() {
    return minTemp;
  }
  /**
   * max temp getter
   * @return {Number}
   */
  function getMaxTemp() {
    return maxTemp;
  }

  /**
   * temp getter
   * @return {Number}
   */
  function getTemp() {
    return temp;
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

  return {
    getMinTemp,
    getMaxTemp,
    getTemp,
    getHumidity,
    getFeelsLike,
    getWeather,
    getWeatherDesc,
    getDate
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
  console.log(forecastResposne);
  _elementLoader__WEBPACK_IMPORTED_MODULE_1__["default"].loadToday(weather);
  _elementLoader__WEBPACK_IMPORTED_MODULE_1__["default"].loadForecast(forecast);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ1E7QUFDZ0I7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQWU7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRSwyREFBa0I7QUFDcEIsZ0NBQWdDLG9FQUEyQjtBQUMzRCxpQ0FBaUMscUVBQTRCO0FBQzdEO0FBQ0Esa0JBQWtCLHdEQUFjO0FBQ2hDLG1CQUFtQix5REFBZTtBQUNsQztBQUNBLEVBQUUsZ0VBQXVCO0FBQ3pCLEVBQUUsbUVBQTBCO0FBQzVCLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL2FwaUNhbGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL2VsZW1lbnRMb2FkZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy93ZWF0aGVyLmpzIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFwaUNhbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHppcFJlZ2V4ID0gLyheXFxkezV9JCkvO1xuICBjb25zdCBsb25nTGF0UmVnZXggPSAvKC0/XFxkezEsMn0oXFwuXFxkKyk/KVxccygtP1xcZHsxLDJ9KFxcLlxcZCspPykvO1xuICBsZXQgc3lzdGVtID0gXCJpbXBlcmlhbFwiO1xuICBsZXQgdXJsID0gbnVsbDtcbiAgLyoqXG4gICAqIHBhcnNlcyB1c2VyIGlucHV0IGFuZCBjcmVhdGVzIHRoZSBjb3JyZWN0IHVybCBmb3IgdGhlIGFwaSBjYWxsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXQgdXNlciBpbnB1dC4gY291bGQgYmUgemlwY29kZSwgY2l0eSBuYW1lLCBvciBsb25nL2xhdCBjb29yZHMuXG4gICAqL1xuICBmdW5jdGlvbiBzZXRJbnB1dChpbnB1dCkge1xuICAgIGlmICh6aXBSZWdleC50ZXN0KGlucHV0KSkge1xuICAgICAgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyPyZ6aXA9JHtpbnB1dH0mdW5pdHM9JHtzeXN0ZW19JmFwcGlkPWE0MTZlNDYxNTliNWUzNWYzNWFlYzUxODU1ODA3NjY5YDtcbiAgICB9IGVsc2UgaWYgKGxvbmdMYXRSZWdleC50ZXN0KGlucHV0KSkge1xuICAgICAgY29uc3QgbG9uZ0xhdCA9IGlucHV0LnNwbGl0KFwiIFwiKTtcbiAgICAgIGNvbnN0IGxhdCA9IGxvbmdMYXRbMF07XG4gICAgICBjb25zdCBsb25nID0gbG9uZ0xhdFsxXTtcbiAgICAgIHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbmd9JnVuaXRzPSR7c3lzdGVtfSZhcHBpZD1hNDE2ZTQ2MTU5YjVlMzVmMzVhZWM1MTg1NTgwNzY2OWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9xPSR7aW5wdXR9JnVuaXRzPSR7c3lzdGVtfSZhcHBpZD1hNDE2ZTQ2MTU5YjVlMzVmMzVhZWM1MTg1NTgwNzY2OWA7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiB0YWtlcyBhIHVybCB0byBtYWtlIGFuIGFwaSBjYWxsLCBwYXJzZXMgYW5kIHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdGhlIGFwaSBsaW5rIHRvIGZldGNoIHdlYXRoZXIgaW5mb3JtYXRpb24gZnJvbVxuICAgKiBAcmV0dXJuIHtvYmplY3R9IGRhdGEgLSB0aGUgZGF0YSBjb250YWluaW5nIHRoZSB3ZWF0aGVyIGluZm9ybWF0aW9uXG4gICAqL1xuICBhc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcigpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqL1xuICBhc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyRm9yZWNhc3QoKXtcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JlY2FzdFVSTCA9IHVybC5yZXBsYWNlKFwid2VhdGhlcj9cIiwgXCJmb3JlY2FzdD9cIik7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZvcmVjYXN0VVJMKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvKipcbiAgICogc2V0cyB0aGUgbWVhc3VyZW1lbnQgc3lzdGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdTeXN0ZW0gc3RyaW5nIHdpdGggdGhlIHR5cGUgb2YgbWVhc3VyZW1lbnQgc3lzdGVtIHRvIHVzZVxuICAgKi9cbiAgZnVuY3Rpb24gc2V0U3lzdGVtKG5ld1N5c3RlbSkge1xuICAgIGlmIChcbiAgICAgIG5ld1N5c3RlbS50b0xvd2VyQ2FzZSgpICE9IFwiaW1wZXJpYWxcIiAmJlxuICAgICAgbmV3U3lzdGVtLnRvTG93ZXJDYXNlKCkgIT0gXCJtZXRyaWNcIlxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzeXN0ZW0gPSBuZXdTeXN0ZW07XG4gIH1cblxuICByZXR1cm4geyBnZXRDdXJyZW50V2VhdGhlciwgc2V0SW5wdXQsIHNldFN5c3RlbSwgZ2V0V2VhdGhlckZvcmVjYXN0fTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFwaUNhbGxlcjtcbiIsImNvbnN0IGVsZW1lbnRMb2FkZXIgPSBmdW5jdGlvbigpe1xuICAvLyBnZXQgaHRtbCB0b2RheSBlbGVtZW50c1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgY29uc3QgdG9kYXlJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kYXkgaW1nJyk7XG4gIGNvbnN0IHdlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kYXkgLndlYXRoZXInKTtcbiAgY29uc3Qgd2VhdGhlckRlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kYXkgLmRlc2NyaXB0aW9uJyk7XG4gIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kYXkgLnRlbXAnKTtcbiAgY29uc3QgdGVtcEhpZ2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kYXkgLmhpZ2gnKTtcbiAgY29uc3QgdGVtcExvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RheSAubG93Jyk7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvZGF5IC5odW1pZGl0eScpO1xuXG4gIC8vIGdldCBodG1sIGZvcmVjYXN0IGVsZW1lbnRzXG4gIGNvbnN0IGZvcmVjYXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQnKTtcbiAgY29uc3QgaW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQgaW1nJyk7XG4gIGNvbnN0IGZXZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQgLmNXZWF0aGVyJyk7XG4gIGNvbnN0IGZUZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQgLmNUZW1wJyk7XG4gIGNvbnN0IGRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQgLmRhdGUnKTtcblxuICAvKipcbiAgICogbG9hZHMgdG9kYXkncyB3ZWF0aGVyIGRhdGEgb250byBpbmRleC5odG1sXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkVG9kYXkod2VhdGhlckRhdGEpe1xuICAgIGlmICh3ZWF0aGVyRGF0YSA9PT0gbnVsbCl7XG4gICAgICBjb25zb2xlLmxvZygnbm8gd2VhdGhlciBkYXRhIGxvYWRlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYm9keS5jbGFzc0xpc3QgPSBcIlwiO1xuICAgIGJvZHkuY2xhc3NMaXN0ID0gd2VhdGhlckRhdGEuZ2V0V2VhdGhlcigpO1xuICAgIHRvZGF5SW1nLnNyYyA9IGAuLi9pbWFnZXMvJHt3ZWF0aGVyRGF0YS5nZXRXZWF0aGVyKCl9LnBuZ2A7XG4gICAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXIoKTtcbiAgICB3ZWF0aGVyRGVzYy50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFdlYXRoZXJEZXNjKCk7XG4gICAgdGVtcC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFRlbXAoKTtcbiAgICB0ZW1wSGlnaC50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldE1heFRlbXAoKTtcbiAgICB0ZW1wTG93LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0TWluVGVtcCgpO1xuICAgIGh1bWlkaXR5LnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0SHVtaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsb2FkcyBkYXRhIG9udG8gaHRtbFxuICAgKiBAcGFyYW0ge0FycmF5fSBmb3JlY2FzdERhdGEgXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkRm9yZWNhc3QoZm9yZWNhc3REYXRhKXtcbiAgICBmb3IgKGxldCBpICA9IDA7IGkgPCBmb3JlY2FzdERhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgZm9yZWNhc3RbaV0uY2xhc3NMaXN0ID0gXCJjYXJkXCI7XG4gICAgICBmb3JlY2FzdFtpXS5jbGFzc0xpc3QuYWRkKGAke2ZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCl9YClcbiAgICAgIGltYWdlc1tpXS5zcmMgPSBgLi4vaW1hZ2VzLyR7Zm9yZWNhc3REYXRhW2ldLmdldFdlYXRoZXIoKX0ucG5nYDtcbiAgICAgIGZXZWF0aGVyW2ldLnRleHRDb250ZW50ID0gZm9yZWNhc3REYXRhW2ldLmdldFdlYXRoZXIoKTtcbiAgICAgIGZUZW1wW2ldLnRleHRDb250ZW50ID0gZm9yZWNhc3REYXRhW2ldLmdldFRlbXAoKTtcbiAgICAgIGRhdGVzW2ldLnRleHRDb250ZW50ID0gZm9yZWNhc3REYXRhW2ldLmdldERhdGUoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge2xvYWRUb2RheSwgbG9hZEZvcmVjYXN0fVxufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBlbGVtZW50TG9hZGVyOyIsIi8qKlxuICogR2V0cyBvYmplY3QgZnJvbSBhcGkgY2FsbCBhbmQgZXh0cmFjdHMvb3JnYW5pemVzIGRlc2lyZWQgZGF0YVxuICogQHBhcmFtIHt7T2JqZWN0fX0gd2VhdGhlckRhdGFcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdlYXRoZXJGYWN0b3J5KHdlYXRoZXJEYXRhKSB7XG4gIGNvbnN0IG1pblRlbXAgPSB3ZWF0aGVyRGF0YS5tYWluLnRlbXBfbWluO1xuICBjb25zdCBtYXhUZW1wID0gd2VhdGhlckRhdGEubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcCA9IHdlYXRoZXJEYXRhLm1haW4udGVtcDtcbiAgY29uc3QgaHVtaWRpdHkgPSB3ZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5O1xuICBjb25zdCBmZWVsc0xpa2UgPSB3ZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHdlYXRoZXIgPSB3ZWF0aGVyRGF0YS53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJEZXNjID0gd2VhdGhlckRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbjtcbiAgY29uc3QgZGF0ZSA9IHdlYXRoZXJEYXRhLmR0X3R4dDtcbiAgLyoqXG4gICAqIG1pbiB0ZW1wIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG1pbmltdW0gdGVtcGVyYXR1cmVcbiAgICovXG4gIGZ1bmN0aW9uIGdldE1pblRlbXAoKSB7XG4gICAgcmV0dXJuIG1pblRlbXA7XG4gIH1cbiAgLyoqXG4gICAqIG1heCB0ZW1wIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRNYXhUZW1wKCkge1xuICAgIHJldHVybiBtYXhUZW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIHRlbXAgZ2V0dGVyXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFRlbXAoKSB7XG4gICAgcmV0dXJuIHRlbXA7XG4gIH1cblxuICAvKipcbiAgICogaHVtaWRpdHkgZ2V0dGVyXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEh1bWlkaXR5KCkge1xuICAgIHJldHVybiBodW1pZGl0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBmZWVsc0xpa2UgZ2V0dGVyXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZlZWxzTGlrZSgpIHtcbiAgICByZXR1cm4gZmVlbHNMaWtlO1xuICB9XG4gIC8qKlxuICAgKiB3ZWF0aGVyIGdldHRlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRXZWF0aGVyKCkge1xuICAgIHJldHVybiB3ZWF0aGVyO1xuICB9XG4gIC8qKlxuICAgKiB3ZWF0aGVyIGRlc2MgZ2V0dGVyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldFdlYXRoZXJEZXNjKCkge1xuICAgIHJldHVybiB3ZWF0aGVyRGVzYztcbiAgfVxuICAvKipcbiAgICogZ2V0IHdlYXRoZXIgRGF0ZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXREYXRlKCl7XG4gICAgcmV0dXJuIGRhdGUuc2xpY2UoNSwxMCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldE1pblRlbXAsXG4gICAgZ2V0TWF4VGVtcCxcbiAgICBnZXRUZW1wLFxuICAgIGdldEh1bWlkaXR5LFxuICAgIGdldEZlZWxzTGlrZSxcbiAgICBnZXRXZWF0aGVyLFxuICAgIGdldFdlYXRoZXJEZXNjLFxuICAgIGdldERhdGVcbiAgfTtcbn1cbi8qKlxuICogY3JlYXRlcyBtdWx0aXBsZSB3ZWF0aGVyIG9iamVjdHMgZnJvbSBmb3JlY2FzdCBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gZm9yZWNhc3REYXRhXG4gKiBAcmV0dXJuIHthcnJheX0gYXJyYXkgb2Ygb2JqZWN0c1xuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmVjYXN0RmFjdG9yeShmb3JlY2FzdERhdGEpIHtcbiAgaWYgKCFmb3JlY2FzdERhdGEuY29kIHx8IGZvcmVjYXN0RGF0YS5jb2QgIT09IFwiMjAwXCIpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgZGF5MSA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzVdKTtcbiAgY29uc3QgZGF5MiA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzEzXSk7XG4gIGNvbnN0IGRheTMgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFsyMV0pO1xuICBjb25zdCBkYXk0ID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMjldKTtcbiAgY29uc3QgZGF5NSA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzM3XSk7XG5cbiAgcmV0dXJuIFtkYXkxLCBkYXkyLCBkYXkzLCBkYXk0LCBkYXk1XTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGFwaUNhbGxlciBmcm9tICcuL2FwaUNhbGxlcic7XG5pbXBvcnQgZWxlbWVudExvYWRlciBmcm9tICcuL2VsZW1lbnRMb2FkZXInO1xuaW1wb3J0IHsgd2VhdGhlckZhY3RvcnksIGZvcmVjYXN0RmFjdG9yeSB9IGZyb20gJy4vd2VhdGhlcic7XG4vKipcbiAqXG4gKi9cbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2hGb3JtJyk7XG5zZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgbG9hZFBhZ2UpO1xuLyoqXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nL051bWJlcn0gaW5wdXQgXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYWdlKGV2ZW50KXtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoJykudmFsdWU7XG5cbiAgYXBpQ2FsbGVyLnNldElucHV0KGlucHV0KTtcbiAgY29uc3Qgd2VhdGhlclJlc3BvbnNlID0gYXdhaXQgYXBpQ2FsbGVyLmdldEN1cnJlbnRXZWF0aGVyKCk7XG4gIGNvbnN0IGZvcmVjYXN0UmVzcG9zbmUgPSBhd2FpdCBhcGlDYWxsZXIuZ2V0V2VhdGhlckZvcmVjYXN0KCk7XG4gIFxuICBjb25zdCB3ZWF0aGVyID0gd2VhdGhlckZhY3Rvcnkod2VhdGhlclJlc3BvbnNlKTtcbiAgY29uc3QgZm9yZWNhc3QgPSBmb3JlY2FzdEZhY3RvcnkoZm9yZWNhc3RSZXNwb3NuZSk7XG4gIGNvbnNvbGUubG9nKGZvcmVjYXN0UmVzcG9zbmUpO1xuICBlbGVtZW50TG9hZGVyLmxvYWRUb2RheSh3ZWF0aGVyKTtcbiAgZWxlbWVudExvYWRlci5sb2FkRm9yZWNhc3QoZm9yZWNhc3QpO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==