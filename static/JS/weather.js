// Function to update weather data
function updateWeather(latitude, longitude) {
  $.get(
    `/weather_data?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
      $("#value-temp").text(data.temp_c + "°C");
      $("#value-humidity").text(data.humidity + "%");
      $("#current-temp").text("Current: " + data.temp_c + "°C");
      $("#current-hum").text("Current: " + data.humidity + "%");
    }
  ).fail(function () {
    alert("Error fetching weather data.");
  });
}

// Fetch and render the hourly data using renderChart
function renderHourlyData(latitude, longitude) {
  $.get(
    `/hourly_data?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
      const formattedTimes = data.times.map((time) => {
        const date = new Date(time);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      });
      // Render hourly temperature chart
      renderChart("bar-temp-today-chart", "bar", formattedTimes, data.temps, {
        chartTitle: "Hourly Temperature Today (°C)",
        datasetLabel: "Temperature (°C)",
        xAxisLabel: "Time",
        yAxisLabel: "Temperature (°C)",
        backgroundColor: data.temps.map((temp) => getColorForTemperature(temp)),
        borderColor: "rgba(255, 99, 132, 1)",
        displayLegend: true,
      });

      // Render hourly humidity chart
      renderChart("hum-today-chart", "line", formattedTimes, data.humidity, {
        chartTitle: "Hourly Humidity Today (%)",
        datasetLabel: "Humidity (%)",
        xAxisLabel: "Time",
        yAxisLabel: "Humidity (%)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        displayLegend: true,
      });
    }
  );
}

// Fetch and render the 7-day average data using renderChart
function renderSevenDayData(latitude, longitude) {
  $.get(
    `/seven_day_data?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
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
    }
  );
}

$(document).ready(function () {
  updateWeather("35.166668", "129.066666");
  renderHourlyData("35.166668", "129.066666");
  renderSevenDayData("35.166668", "129.066666");
});

//setInterval(updateWeather, 100000);
