$(document).ready(function () {
  const currentCity = window.getCurrentCity();

  updateWeather(currentCity.latitude, currentCity.longitude);

  setInterval(() => {
    const currentCity = window.getCurrentCity();
    updateWeather(currentCity.latitude, currentCity.longitude);
  }, 60000);
});

function updateWeather(latitude, longitude) {
  $.get(
    `/weather_dashboard_data?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
      $("#temp_c").text(data.temp_c + "°C");
      $("#humidity").text(data.humidity + "%");
      $("#sunrise").text(data.sunrise);
      $("#sunset").text(data.sunset);
      $("#wind-speed").text(data["wind-speed"] + " m/s");
      $("#wind-direction").text(data["wind-direction"] + "°");
      $("#cloud-coverage").text(data["cloud-coverage"] + "%");
      $("#feels-like-temp").text(data["feels-like-temp"] + "°C");
      $("#uv").text(data.uv);
      $("#weather-description").text(data["weather-description"]);
      $("#snow").text(data.snow + " mm");
      $("#solar-radiation").text(data["solar-radiation"] + " W/m²");

      const weatherCode = data["weather-code"];
      const weatherContainer = document.querySelector(".weather-container");

      weatherContainer.classList.remove(
        "weather-code-200",
        "weather-code-201",
        "weather-code-202",
        "weather-code-300",
        "weather-code-301",
        "weather-code-302",
        "weather-code-500",
        "weather-code-501",
        "weather-code-502",
        "weather-code-600",
        "weather-code-601",
        "weather-code-602",
        "weather-code-800",
        "weather-code-801",
        "weather-code-802",
        "weather-code-803",
        "weather-code-804"
      );

      weatherContainer.classList.add(`weather-code-${weatherCode}`);
    }
  ).fail(function () {
    alert("Error fetching weather data.");
  });
}
