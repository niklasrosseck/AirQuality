// Trying out the API
function fetchWeatherData(city) {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

  $.ajax({
    url: url,
    method: "GET",
    success: function (response) {
      // Extracting the data needed from the json
      const temperature = response.current.temp_c;
      const humidity = response.current.humidity;
      $("#temp-value").text(`${temperature}°C`);
      $("#humidity-value").text(`${humidity}%`);
    },
    error: function (error) {
      console.error("Error fetching weather data:", error);
    },
  });
}
$(document).ready(function () {
  fetchWeatherData("Berlin");
});
