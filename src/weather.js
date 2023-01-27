/**
 * Gets object from api call and extracts/organizes desired data
 * @param {{Object}} weatherData
 * @return {Object}
 */
export function weatherFactory(weatherData) {
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
export function forecastFactory(forecastData) {
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
