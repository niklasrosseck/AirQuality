// Function to update weather data every 10 seconds
function updateWeather() {
  $.get("/weather_data", function (data) {
    $("#value-temp").text(data.temp_c + "°C");
    $("#value-humidity").text(data.humidity + "%");
    $("#current-temp").text("Current:" + data.temp_c + "°C");
    $("#current-hum").text("Current:" + data.humidity + "%");
  });
}

// Fetch and render the hourly data using renderChart
function renderHourlyData() {
  $.get("/hourly_data", function (data) {
    // Render hourly temperature chart
    renderChart("bar-temp-today-chart", "bar", data.times, data.temps, {
      chartTitle: "Hourly Temperature (°C)",
      datasetLabel: "Temperature (°C)",
      xAxisLabel: "Time",
      yAxisLabel: "Temperature (°C)",
      backgroundColor: data.temps.map((temp) => getColorForTemperature(temp)), // Optional: Dynamic color based on temperature
      borderColor: "rgba(255, 99, 132, 1)",
      displayLegend: true,
    });

    // Render hourly humidity chart
    renderChart("hum-today-chart", "line", data.times, data.humidity, {
      chartTitle: "Hourly Humidity (%)",
      datasetLabel: "Humidity (%)",
      xAxisLabel: "Time",
      yAxisLabel: "Humidity (%)",
      backgroundColor: "rgba(54, 162, 235, 0.2)", // Optional: Static color for humidity
      borderColor: "rgba(54, 162, 235, 1)",
      displayLegend: true,
    });
  });
}

// Fetch and render the 7-day average data using renderChart
function renderSevenDayData() {
  $.get("/seven_day_data", function (data) {
    // Render 7-day average temperature chart
    renderChart("bar-temp-7days-chart", "bar", data.dates, data.temps, {
      chartTitle: "7-Day Average Temperature (°C)",
      datasetLabel: "Average Temperature (°C)",
      xAxisLabel: "Day",
      yAxisLabel: "Temperature (°C)",
      backgroundColor: data.temps.map((temp) => getColorForTemperature(temp)),
      borderColor: "rgba(255, 99, 132, 1)",
      displayLegend: true,
    });

    // Render 7-day average humidity chart
    renderChart("hum-7days-chart", "line", data.dates, data.humidity, {
      chartTitle: "7-Day Average Humidity (%)",
      datasetLabel: "Average Humidity (%)",
      xAxisLabel: "Day",
      yAxisLabel: "Humidity (%)",
      backgroundColor: "rgba(54, 162, 235, 0.2)", // Light blue for humidity bars
      borderColor: "rgba(54, 162, 235, 1)",
      displayLegend: true,
    });
  });
}

// Call functions on page load
$(document).ready(function () {
  updateWeather();
  renderHourlyData();
  renderSevenDayData();
});

// Update the weather every 10 seconds (for testing purposes)
setInterval(updateWeather, 10000); // Update every 10 seconds (for testing purposes)
