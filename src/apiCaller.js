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
  async function getResponse() {
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

  return { getResponse, setInput, setSystem };
})();

export default apiCaller;
