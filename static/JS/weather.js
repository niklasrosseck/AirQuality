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
    $("#yesterday-temp").text("Yesterday:" + data.temps[5] + "°C");
    $("#yesterday-hum").text("Yesterday:" + data.humidity[5] + "%");

    const avg7DaysTemp = (
      data.temps.reduce((a, b) => a + b, 0) / data.temps.length
    ).toFixed(2);

    const avg7DaysHum = (
      data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length
    ).toFixed(2);

    $("#avg-7days-temp").text(`7-day Avg: ${avg7DaysTemp}°C`);
    $("#avg-7days-hum").text(`7-day Avg: ${avg7DaysHum}%`);

    renderChart("bar-temp-7days-chart", "bar", data.dates, data.temps, {
      chartTitle: "7-Day Average Temperature (°C)",
      datasetLabel: "Average Temperature (°C)",
      xAxisLabel: "Day",
      yAxisLabel: "Temperature (°C)",
      backgroundColor: data.temps.map((temp) => getColorForTemperature(temp)),
      borderColor: "rgba(255, 99, 132, 1)",
      displayLegend: true,
    });

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

$(document).ready(function () {
  updateWeather();
  renderHourlyData();
  renderSevenDayData();
});

//setInterval(updateWeather, 100000);
