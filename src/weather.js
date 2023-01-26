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
