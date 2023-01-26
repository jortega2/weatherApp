import apiCaller from "./apiCaller";
import elementLoader from "./elementLoader";
import { weatherFactory, forecastFactory } from "./weather";
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
  let weatherResponse;
  let forecastResponse

  apiCaller.setInput(input);
  try{
    weatherResponse = await apiCaller.getCurrentWeather();
    forecastResponse = await apiCaller.getWeatherForecast();
  } catch (error){
    console.log(error);
  }
  
  if (weatherResponse.cod !== 200 || forecastResponse.cod !== "200"){
    alert('Location not found');
    return;
  }

  const weather = weatherFactory(weatherResponse);
  const forecast = forecastFactory(forecastResponse);
  
  elementLoader.loadToday(weather);
  elementLoader.loadForecast(forecast);
}
