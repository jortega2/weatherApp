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
  const unit = document.getElementById('unit').checked;
  if (unit){
    apiCaller.setSystem("metric");
  } else {
    apiCaller.setSystem("imperial");
  }

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
  weather.setUnit(unit);
  const forecast = forecastFactory(forecastResponse);
  forecast.forEach((weatherObj)=>{
    weatherObj.setUnit(unit);
  })
  
  elementLoader.loadToday(weather);
  elementLoader.loadForecast(forecast);
}
