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
    todayImg.src = `images/${weatherData.getWeather()}.png`;
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
      console.log(`images/${forecastData[i].getWeather()}.png`);
      images[i].src = `images/${forecastData[i].getWeather()}.png`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EseUJBQXlCLEVBQUU7QUFDM0IsOEJBQThCLElBQUksaUJBQWlCLElBQUk7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLE1BQU0sU0FBUyxPQUFPO0FBQzFGLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsSUFBSSxPQUFPLEtBQUssU0FBUyxPQUFPO0FBQ25HLE1BQU07QUFDTixpRUFBaUUsTUFBTSxTQUFTLE9BQU87QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVELGlFQUFlLFNBQVMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDMUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIseUJBQXlCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBLG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQSxtQ0FBbUMsNkJBQTZCO0FBQ2hFLDRCQUE0Qiw2QkFBNkI7QUFDekQsZ0NBQWdDLDZCQUE2QjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVELGlFQUFlLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzdEN0I7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZO0FBQ1o7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQSwrQ0FBK0MsS0FBSztBQUNwRDtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLCtDQUErQyxLQUFLO0FBQ3BEOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLDRDQUE0QyxLQUFLO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYywwQkFBMEIsRUFBRSxJQUFJO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7VUMxSUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ1E7QUFDZ0I7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQWU7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSw0REFBbUI7QUFDdkIsSUFBSTtBQUNKLElBQUksNERBQW1CO0FBQ3ZCOztBQUVBO0FBQ0E7O0FBRUEsRUFBRSwyREFBa0I7QUFDcEI7QUFDQSw0QkFBNEIsb0VBQTJCO0FBQ3ZELDZCQUE2QixxRUFBNEI7QUFDekQsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQix3REFBYztBQUNoQztBQUNBLG1CQUFtQix5REFBZTtBQUNsQztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsRUFBRSxnRUFBdUI7QUFDekIsRUFBRSxtRUFBMEI7QUFDNUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL2FwaUNhbGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL2VsZW1lbnRMb2FkZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC8uL3NyYy93ZWF0aGVyLmpzIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFwaUNhbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHppcFJlZ2V4ID0gLyheXFxkezV9JCkvO1xuICBjb25zdCBsb25nTGF0UmVnZXggPSAvKC0/XFxkezEsMn0oXFwuXFxkKyk/KVxccygtP1xcZHsxLDJ9KFxcLlxcZCspPykvO1xuICBsZXQgc3lzdGVtID0gXCJpbXBlcmlhbFwiO1xuICBsZXQgdXJsID0gbnVsbDtcbiAgLyoqXG4gICAqIHBhcnNlcyB1c2VyIGlucHV0IGFuZCBjcmVhdGVzIHRoZSBjb3JyZWN0IHVybCBmb3IgdGhlIGFwaSBjYWxsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXQgdXNlciBpbnB1dC4gY291bGQgYmUgemlwY29kZSwgY2l0eSBuYW1lLCBvciBsb25nL2xhdCBjb29yZHMuXG4gICAqL1xuICBmdW5jdGlvbiBzZXRJbnB1dChpbnB1dCkge1xuICAgIGlmICh6aXBSZWdleC50ZXN0KGlucHV0KSkge1xuICAgICAgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyPyZ6aXA9JHtpbnB1dH0mdW5pdHM9JHtzeXN0ZW19JmFwcGlkPWE0MTZlNDYxNTliNWUzNWYzNWFlYzUxODU1ODA3NjY5YDtcbiAgICB9IGVsc2UgaWYgKGxvbmdMYXRSZWdleC50ZXN0KGlucHV0KSkge1xuICAgICAgY29uc3QgbG9uZ0xhdCA9IGlucHV0LnNwbGl0KFwiIFwiKTtcbiAgICAgIGNvbnN0IGxhdCA9IGxvbmdMYXRbMF07XG4gICAgICBjb25zdCBsb25nID0gbG9uZ0xhdFsxXTtcbiAgICAgIHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbmd9JnVuaXRzPSR7c3lzdGVtfSZhcHBpZD1hNDE2ZTQ2MTU5YjVlMzVmMzVhZWM1MTg1NTgwNzY2OWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9xPSR7aW5wdXR9JnVuaXRzPSR7c3lzdGVtfSZhcHBpZD1hNDE2ZTQ2MTU5YjVlMzVmMzVhZWM1MTg1NTgwNzY2OWA7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiB0YWtlcyBhIHVybCB0byBtYWtlIGFuIGFwaSBjYWxsLCBwYXJzZXMgYW5kIHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdGhlIGFwaSBsaW5rIHRvIGZldGNoIHdlYXRoZXIgaW5mb3JtYXRpb24gZnJvbVxuICAgKiBAcmV0dXJuIHtvYmplY3R9IGRhdGEgLSB0aGUgZGF0YSBjb250YWluaW5nIHRoZSB3ZWF0aGVyIGluZm9ybWF0aW9uXG4gICAqL1xuICBhc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcigpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIGFzeW5jIGZ1bmN0aW9uIGdldFdlYXRoZXJGb3JlY2FzdCgpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JlY2FzdFVSTCA9IHVybC5yZXBsYWNlKFwid2VhdGhlcj9cIiwgXCJmb3JlY2FzdD9cIik7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZvcmVjYXN0VVJMKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvKipcbiAgICogc2V0cyB0aGUgbWVhc3VyZW1lbnQgc3lzdGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdTeXN0ZW0gc3RyaW5nIHdpdGggdGhlIHR5cGUgb2YgbWVhc3VyZW1lbnQgc3lzdGVtIHRvIHVzZVxuICAgKi9cbiAgZnVuY3Rpb24gc2V0U3lzdGVtKG5ld1N5c3RlbSkge1xuICAgIGlmIChcbiAgICAgIG5ld1N5c3RlbS50b0xvd2VyQ2FzZSgpICE9IFwiaW1wZXJpYWxcIiAmJlxuICAgICAgbmV3U3lzdGVtLnRvTG93ZXJDYXNlKCkgIT0gXCJtZXRyaWNcIlxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzeXN0ZW0gPSBuZXdTeXN0ZW07XG4gIH1cblxuICByZXR1cm4geyBnZXRDdXJyZW50V2VhdGhlciwgc2V0SW5wdXQsIHNldFN5c3RlbSwgZ2V0V2VhdGhlckZvcmVjYXN0IH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBhcGlDYWxsZXI7XG4iLCJjb25zdCBlbGVtZW50TG9hZGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gZ2V0IGh0bWwgdG9kYXkgZWxlbWVudHNcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IHRvZGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheVwiKTtcbiAgY29uc3QgdG9kYXlJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IGltZ1wiKTtcbiAgY29uc3Qgd2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgLndlYXRoZXJcIik7XG4gIGNvbnN0IHdlYXRoZXJEZXNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSAuZGVzY3JpcHRpb25cIik7XG4gIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IC50ZW1wXCIpO1xuICBjb25zdCB0ZW1wSGlnaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kYXkgLmhpZ2hcIik7XG4gIGNvbnN0IHRlbXBMb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZGF5IC5sb3dcIik7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RheSAuaHVtaWRpdHlcIik7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aXRsZVwiKTtcblxuICAvLyBnZXQgaHRtbCBmb3JlY2FzdCBlbGVtZW50c1xuICBjb25zdCBmb3JlY2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcbiAgY29uc3QgaW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkIGltZ1wiKTtcbiAgY29uc3QgZldlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQgLmNXZWF0aGVyXCIpO1xuICBjb25zdCBmVGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZCAuY1RlbXBcIik7XG4gIGNvbnN0IGRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkIC5kYXRlXCIpO1xuXG4gIC8qKlxuICAgKiBsb2FkIGRhdGEgb250byBodG1sXG4gICAqIEBwYXJhbSB7b2JqZWN0fX0gd2VhdGhlckRhdGFcbiAgICovXG4gIGZ1bmN0aW9uIGxvYWRUb2RheSh3ZWF0aGVyRGF0YSkge1xuICAgIGlmICh3ZWF0aGVyRGF0YSA9PT0gbnVsbCkge1xuICAgICAgY29uc29sZS5sb2coXCJubyB3ZWF0aGVyIGRhdGEgbG9hZGVkLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYm9keS5jbGFzc0xpc3QgPSBcIlwiO1xuICAgIGJvZHkuY2xhc3NMaXN0ID0gd2VhdGhlckRhdGEuZ2V0V2VhdGhlcigpO1xuICAgIHRvZGF5LmNsYXNzTGlzdCA9IFwidG9kYXlcIjtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHdlYXRoZXJEYXRhLmdldFRpdGxlKCk7XG4gICAgdG9kYXlJbWcuc3JjID0gYGltYWdlcy8ke3dlYXRoZXJEYXRhLmdldFdlYXRoZXIoKX0ucG5nYDtcbiAgICB3ZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0V2VhdGhlcigpO1xuICAgIHdlYXRoZXJEZXNjLnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0V2VhdGhlckRlc2MoKTtcbiAgICB0ZW1wLnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0VGVtcCgpO1xuICAgIHRlbXBIaWdoLnRleHRDb250ZW50ID0gd2VhdGhlckRhdGEuZ2V0TWF4VGVtcCgpO1xuICAgIHRlbXBMb3cudGV4dENvbnRlbnQgPSB3ZWF0aGVyRGF0YS5nZXRNaW5UZW1wKCk7XG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSB3ZWF0aGVyRGF0YS5nZXRIdW1pZGl0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxvYWRzIGRhdGEgb250byBodG1sXG4gICAqIEBwYXJhbSB7QXJyYXl9IGZvcmVjYXN0RGF0YSBhcnJheSBvZiB3ZWF0aGVyIG9iamVjdHNcbiAgICovXG4gIGZ1bmN0aW9uIGxvYWRGb3JlY2FzdChmb3JlY2FzdERhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcmVjYXN0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yZWNhc3RbaV0uY2xhc3NMaXN0ID0gXCJjYXJkXCI7XG4gICAgICBmb3JlY2FzdFtpXS5jbGFzc0xpc3QuYWRkKGAke2ZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCl9YCk7XG4gICAgICBjb25zb2xlLmxvZyhgaW1hZ2VzLyR7Zm9yZWNhc3REYXRhW2ldLmdldFdlYXRoZXIoKX0ucG5nYCk7XG4gICAgICBpbWFnZXNbaV0uc3JjID0gYGltYWdlcy8ke2ZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCl9LnBuZ2A7XG4gICAgICBmV2VhdGhlcltpXS50ZXh0Q29udGVudCA9IGZvcmVjYXN0RGF0YVtpXS5nZXRXZWF0aGVyKCk7XG4gICAgICBmVGVtcFtpXS50ZXh0Q29udGVudCA9IGZvcmVjYXN0RGF0YVtpXS5nZXRUZW1wKCk7XG4gICAgICBkYXRlc1tpXS50ZXh0Q29udGVudCA9IGZvcmVjYXN0RGF0YVtpXS5nZXREYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgbG9hZFRvZGF5LCBsb2FkRm9yZWNhc3QgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGVsZW1lbnRMb2FkZXI7XG4iLCIvKipcbiAqIEdldHMgb2JqZWN0IGZyb20gYXBpIGNhbGwgYW5kIGV4dHJhY3RzL29yZ2FuaXplcyBkZXNpcmVkIGRhdGFcbiAqIEBwYXJhbSB7e09iamVjdH19IHdlYXRoZXJEYXRhXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3ZWF0aGVyRmFjdG9yeSh3ZWF0aGVyRGF0YSkge1xuICBjb25zdCBtaW5UZW1wID0gd2VhdGhlckRhdGEubWFpbi50ZW1wX21pbjtcbiAgY29uc3QgbWF4VGVtcCA9IHdlYXRoZXJEYXRhLm1haW4udGVtcF9tYXg7XG4gIGNvbnN0IHRlbXAgPSB3ZWF0aGVyRGF0YS5tYWluLnRlbXA7XG4gIGNvbnN0IGh1bWlkaXR5ID0gd2VhdGhlckRhdGEubWFpbi5odW1pZGl0eTtcbiAgY29uc3QgZmVlbHNMaWtlID0gd2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlO1xuICBjb25zdCB3ZWF0aGVyID0gd2VhdGhlckRhdGEud2VhdGhlclswXS5tYWluO1xuICBjb25zdCB3ZWF0aGVyRGVzYyA9IHdlYXRoZXJEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG4gIGNvbnN0IGRhdGUgPSB3ZWF0aGVyRGF0YS5kdF90eHQ7XG4gIGxldCB1bml0ID0gXCJGXCI7XG4gIGNvbnN0IHRpdGxlID0gd2VhdGhlckRhdGEubmFtZTtcbiAgLyoqXG4gICAqIFVwZGF0ZSB1bml0IG9mIG1lYXN1cmVtZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdVbml0XG4gICAqL1xuICBmdW5jdGlvbiBzZXRVbml0KG5ld1VuaXQpIHtcbiAgICBpZiAobmV3VW5pdCl7XG4gICAgICB1bml0ID0gXCJDXCI7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBtaW4gdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfSBtaW5pbXVtIHRlbXBlcmF0dXJlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRNaW5UZW1wKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pblRlbXAgKiAxMCkgLyAxMCArIGDCsCR7dW5pdH1gO1xuICB9XG4gIC8qKlxuICAgKiBtYXggdGVtcCBnZXR0ZXJcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0TWF4VGVtcCgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtYXhUZW1wICogMTApIC8gMTAgKyBgwrAke3VuaXR9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiB0ZW1wIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRUZW1wKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRlbXAgKiAxMCkgLyAxMCArIGDCsCR7dW5pdH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIGh1bWlkaXR5IGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRIdW1pZGl0eSgpIHtcbiAgICByZXR1cm4gaHVtaWRpdHk7XG4gIH1cblxuICAvKipcbiAgICogZmVlbHNMaWtlIGdldHRlclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGZWVsc0xpa2UoKSB7XG4gICAgcmV0dXJuIGZlZWxzTGlrZTtcbiAgfVxuICAvKipcbiAgICogd2VhdGhlciBnZXR0ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0V2VhdGhlcigpIHtcbiAgICByZXR1cm4gd2VhdGhlcjtcbiAgfVxuICAvKipcbiAgICogd2VhdGhlciBkZXNjIGdldHRlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRXZWF0aGVyRGVzYygpIHtcbiAgICByZXR1cm4gd2VhdGhlckRlc2M7XG4gIH1cbiAgLyoqXG4gICAqIGdldCB3ZWF0aGVyIERhdGVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0RGF0ZSgpIHtcbiAgICBjb25zdCBtb250aCA9IGRhdGUuc2xpY2UoNSwgNyk7XG4gICAgY29uc3QgZGF5ID0gZGF0ZS5zbGljZSg4LCAxMCk7XG4gICAgY29uc3QgZGF0ZXMgPSBbXG4gICAgICBcIkphblwiLFxuICAgICAgXCJGZWJcIixcbiAgICAgIFwiTWFyXCIsXG4gICAgICBcIkFwclwiLFxuICAgICAgXCJNYXlcIixcbiAgICAgIFwiSnVuZVwiLFxuICAgICAgXCJKdWx5XCIsXG4gICAgICBcIkF1Z1wiLFxuICAgICAgXCJTcGV0XCIsXG4gICAgICBcIk9jdFwiLFxuICAgICAgXCJOb3ZcIixcbiAgICAgIFwiRGVjXCIsXG4gICAgXTtcblxuICAgIHJldHVybiBgJHtkYXRlc1tOdW1iZXIobW9udGgpIC0gMV19ICR7ZGF5fWA7XG4gIH1cbiAgLyoqXG4gICAqIGdldCBuYW1lL3RpdGxlIG9mIGxvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldFRpdGxlKCkge1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0TWluVGVtcCxcbiAgICBnZXRNYXhUZW1wLFxuICAgIGdldFRlbXAsXG4gICAgZ2V0SHVtaWRpdHksXG4gICAgZ2V0RmVlbHNMaWtlLFxuICAgIGdldFdlYXRoZXIsXG4gICAgZ2V0V2VhdGhlckRlc2MsXG4gICAgZ2V0RGF0ZSxcbiAgICBzZXRVbml0LFxuICAgIGdldFRpdGxlLFxuICB9O1xufVxuLyoqXG4gKiBjcmVhdGVzIG11bHRpcGxlIHdlYXRoZXIgb2JqZWN0cyBmcm9tIGZvcmVjYXN0IGRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBmb3JlY2FzdERhdGFcbiAqIEByZXR1cm4ge2FycmF5fSBhcnJheSBvZiBvYmplY3RzXG4gKiovXG5leHBvcnQgZnVuY3Rpb24gZm9yZWNhc3RGYWN0b3J5KGZvcmVjYXN0RGF0YSkge1xuICBpZiAoIWZvcmVjYXN0RGF0YS5jb2QgfHwgZm9yZWNhc3REYXRhLmNvZCAhPT0gXCIyMDBcIikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBkYXkxID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbNV0pO1xuICBjb25zdCBkYXkyID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMTNdKTtcbiAgY29uc3QgZGF5MyA9IHdlYXRoZXJGYWN0b3J5KGZvcmVjYXN0RGF0YS5saXN0WzIxXSk7XG4gIGNvbnN0IGRheTQgPSB3ZWF0aGVyRmFjdG9yeShmb3JlY2FzdERhdGEubGlzdFsyOV0pO1xuICBjb25zdCBkYXk1ID0gd2VhdGhlckZhY3RvcnkoZm9yZWNhc3REYXRhLmxpc3RbMzddKTtcblxuICByZXR1cm4gW2RheTEsIGRheTIsIGRheTMsIGRheTQsIGRheTVdO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgYXBpQ2FsbGVyIGZyb20gXCIuL2FwaUNhbGxlclwiO1xuaW1wb3J0IGVsZW1lbnRMb2FkZXIgZnJvbSBcIi4vZWxlbWVudExvYWRlclwiO1xuaW1wb3J0IHsgd2VhdGhlckZhY3RvcnksIGZvcmVjYXN0RmFjdG9yeSB9IGZyb20gXCIuL3dlYXRoZXJcIjtcbi8qKlxuICpcbiAqL1xuY29uc3Qgc2VhcmNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2hGb3JtXCIpO1xuc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgbG9hZFBhZ2UpO1xuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmcvTnVtYmVyfSBpbnB1dFxuICovXG5hc3luYyBmdW5jdGlvbiBsb2FkUGFnZShldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLnZhbHVlO1xuICBjb25zdCB1bml0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXQnKS5jaGVja2VkO1xuICBpZiAodW5pdCl7XG4gICAgYXBpQ2FsbGVyLnNldFN5c3RlbShcIm1ldHJpY1wiKTtcbiAgfSBlbHNlIHtcbiAgICBhcGlDYWxsZXIuc2V0U3lzdGVtKFwiaW1wZXJpYWxcIik7XG4gIH1cblxuICBsZXQgd2VhdGhlclJlc3BvbnNlO1xuICBsZXQgZm9yZWNhc3RSZXNwb25zZVxuXG4gIGFwaUNhbGxlci5zZXRJbnB1dChpbnB1dCk7XG4gIHRyeXtcbiAgICB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBhcGlDYWxsZXIuZ2V0Q3VycmVudFdlYXRoZXIoKTtcbiAgICBmb3JlY2FzdFJlc3BvbnNlID0gYXdhaXQgYXBpQ2FsbGVyLmdldFdlYXRoZXJGb3JlY2FzdCgpO1xuICB9IGNhdGNoIChlcnJvcil7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9XG4gIFxuICBpZiAod2VhdGhlclJlc3BvbnNlLmNvZCAhPT0gMjAwIHx8IGZvcmVjYXN0UmVzcG9uc2UuY29kICE9PSBcIjIwMFwiKXtcbiAgICBhbGVydCgnTG9jYXRpb24gbm90IGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgd2VhdGhlciA9IHdlYXRoZXJGYWN0b3J5KHdlYXRoZXJSZXNwb25zZSk7XG4gIHdlYXRoZXIuc2V0VW5pdCh1bml0KTtcbiAgY29uc3QgZm9yZWNhc3QgPSBmb3JlY2FzdEZhY3RvcnkoZm9yZWNhc3RSZXNwb25zZSk7XG4gIGZvcmVjYXN0LmZvckVhY2goKHdlYXRoZXJPYmopPT57XG4gICAgd2VhdGhlck9iai5zZXRVbml0KHVuaXQpO1xuICB9KVxuICBcbiAgZWxlbWVudExvYWRlci5sb2FkVG9kYXkod2VhdGhlcik7XG4gIGVsZW1lbnRMb2FkZXIubG9hZEZvcmVjYXN0KGZvcmVjYXN0KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==