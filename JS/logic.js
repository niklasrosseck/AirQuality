// Trying out the API
function fetchWeatherData() {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const latandlong = "35.166668,129.066666";
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latandlong}&aqi=yes`;

  $.ajax({
    url: url,
    method: "GET",
    success: function (response) {
      // Extracting the data needed from the json
      const temperature = response.current.temp_c;
      const humidity = response.current.humidity;
      const pm2_5 = response.current.air_quality.pm2_5;
      $("#temp-value").text(`${temperature}°C`);
      $("#humidity-value").text(`${humidity}%`);
      $("#pm2_5-value").text(`${pm2_5} µg/m³`);
    },
    error: function (error) {
      console.error("Error fetching weather data:", error);
    },
  });
}

// Data for graphs
function fetchHistoricalWeatherData() {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const latandlong = "35.166668,129.066666";
  const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${latandlong}&aqi=yes`;

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  $.ajax({
    url: url,
    method: "GET",
    data: {
      dt: today,
    },
    success: function (response) {
      let dates = [];
      let temps = [];
      let humidities = [];
      response.forecast.forecastday[0].hour.forEach((hour) => {
        dates.push(hour.time);
        temps.push(hour.temp_c);
        humidities.push(hour.humidity);
      });
      renderTemperatureChart(dates, temps);
      renderHumidityChart(dates, humidities);
    },
    error: function (error) {
      console.error("Error fetching historical data", error);
    },
  });
}
// Function for rendering and displaying a temperature chart
function renderTemperatureChart(dates, temps) {
  const ctx = document.getElementById("temp-history-chart").getContext("2d");
  const colors = temps.map((temp) => getColorForTemperature(temp));

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temps,
          backgroundColor: colors,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: "Time" } },
        y: {
          display: true,
          title: { display: true, text: "Temperature (°C)" },
        },
      },
    },
  });
}
// Function for getting dynamic colors
function getColorForTemperature(temp) {
  if (temp >= 30) {
    return "rgba(255, 69, 0, 0.8)"; // Hot: Red-Orange
  } else if (temp >= 20) {
    return "rgba(255, 165, 0, 0.8)"; // Warm: Orange
  } else if (temp >= 10) {
    return "rgba(255, 215, 0, 0.8)"; // Mild: Yellow
  } else if (temp >= 0) {
    return "rgba(135, 206, 250, 0.8)"; // Cool: Light Blue
  } else {
    return "rgba(0, 191, 255, 0.8)"; // Cold: Blue
  }
}
// Function for rendering and displaying the humidity chart
function renderHumidityChart(dates, humidities) {
  const ctx = document
    .getElementById("humidity-history-chart")
    .getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Humidity (%)",
          data: humidities,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: "Time" } },
        y: {
          display: true,
          title: { display: true, text: "Humidity (%)" },
        },
      },
    },
  });
}

$(document).ready(function () {
  fetchWeatherData();
  fetchHistoricalWeatherData();
});
