import apiCaller from './apiCaller';
import elementLoader from './elementLoader';
import { weatherFactory, forecastFactory } from './weather';
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

  apiCaller.setInput(input);
  const weatherResponse = await apiCaller.getCurrentWeather();
  const forecastResposne = await apiCaller.getWeatherForecast();
  
  const weather = weatherFactory(weatherResponse);
  const forecast = forecastFactory(forecastResposne);
  console.log(weatherResponse);
  elementLoader.loadToday(weather);
  elementLoader.loadForecast(forecast);
}