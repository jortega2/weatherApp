/**
 * Gets object from api call and extracts/organizes desired data
 * @param {{Object}} weatherData 
 * @return {Object}
 */
export default function weatherFactory(weatherData) {
  let minTemp;
  let maxTemp;
  let temp;
  let humidity;
  let feelsLike;
  let weather;
  let weatherDesc;

  if (!weatherData.cod || weatherData.cod !== 200) {
    minTemp = 0;
    maxTemp = 0;
    temp = 0;
    humidity = 0;
    feelsLike = 0;
    weather = "Location not found";
    weatherDesc = "Location not found";
  } else {
    minTemp = weatherData.main.temp_min;
    maxTemp = weatherData.main.temp_max;
    temp = weatherData.main.temp;
    humidity = weatherData.main.humidity;
    feelsLike = weatherData.main.feels_like;
    weather = weatherData.weather[0].main;
    weatherDesc = weatherData.weather[0].description;
  }
  /**
   * min temp getter
   * @return {Number} minimum temperature
   */
  function getMinTemp(){
    return minTemp;
  }
  /**
   * max temp getter
  * @return {Number}
   */
  function getMaxTemp(){
    return maxTemp;
  }

  /**
   * temp getter
   * @return {Number}
   */
  function getTemp(){
    return temp;
  }

  /**
   * humidity getter
   * @return {Number}
   */
  function getHumidity(){
    return humidity;
  }

  /**
   * feelsLike getter
   * @return {Number}
   */
  function getFeelsLike(){
    return feelsLike;
  }
  /**
   * weather getter
   * @return {String}
   */
  function getWeather(){
    return weather;
  }
  /**
   * weather desc getter
   * @return {String}
   */
  function getWeatherDesc(){
    return weatherDesc;
  }

  return { getMinTemp, getMaxTemp, getTemp, getHumidity, getFeelsLike, getWeather, getWeatherDesc };
}
