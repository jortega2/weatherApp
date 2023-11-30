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

export default elementLoader;
