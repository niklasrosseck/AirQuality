$(document).ready(function () {
  fetchWeatherData();
  fetchHistoricalWeatherData();
  testHistoricalWeatherData();
});
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

function testHistoricalWeatherData() {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const latandlong = "35.166668,129.066666";
  const baseUrl = `https://api.weatherapi.com/v1/history.json`;

  const dataPoints = []; // Correctly define dataPoints in the outer scope
  const requests = []; // To store all the promises

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i); // Get past dates
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Create a promise for each AJAX request
    const request = $.ajax({
      url: baseUrl,
      method: "GET",
      data: { key: apiKey, q: latandlong, dt: formattedDate },
      success: function (response) {
        dataPoints.push({
          date: response.forecast.forecastday[0].date,
          temp: response.forecast.forecastday[0].day.avgtemp_c,
        });
      },
      error: function (error) {
        console.error("Error fetching data for date:", formattedDate, error);
      },
    });

    requests.push(request);
  }

  // Wait for all requests to complete
  $.when(...requests).done(function () {
    // Sort the data by date (ascending order)
    dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extract sorted dates and temperatures
    const sortedDates = dataPoints.map((point) => point.date);
    const sortedTemps = dataPoints.map((point) => point.temp);

    // Render the chart
    renderTemperatureChart7(sortedDates, sortedTemps);
  });
}

function renderTemperatureChart7(dates, temps) {
  const ctx = document.getElementById("pm2_5-history-chart").getContext("2d");
  const colors = temps.map((temp) => getColorForTemperature(temp));

  new Chart(ctx, {
    type: "line",
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

function testHistoricalWeatherData() {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const latandlong = "35.166668,129.066666";
  const baseUrl = `https://api.weatherapi.com/v1/history.json`;

  const dataPoints = []; // Correctly define dataPoints in the outer scope
  const requests = []; // To store all the promises

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i); // Get past dates
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Create a promise for each AJAX request
    const request = $.ajax({
      url: baseUrl,
      method: "GET",
      data: { key: apiKey, q: latandlong, dt: formattedDate },
      success: function (response) {
        dataPoints.push({
          date: response.forecast.forecastday[0].date,
          temp: response.forecast.forecastday[0].day.avgtemp_c,
        });
      },
      error: function (error) {
        console.error("Error fetching data for date:", formattedDate, error);
      },
    });

    requests.push(request);
  }

  // Wait for all requests to complete
  $.when(...requests).done(function () {
    // Sort the data by date (ascending order)
    dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extract sorted dates and temperatures
    const sortedDates = dataPoints.map((point) => point.date);
    const sortedTemps = dataPoints.map((point) => point.temp);

    // Render the chart
    renderChart(
      "pm2_5-history-chart", // Canvas ID
      "line", // Chart type
      sortedDates, // Labels
      sortedTemps, // Data
      {
        chartTitle: "Last 7 days Temperature",
        datasetLabel: "Temperature (°C)",
        xAxisLabel: "Date",
        yAxisLabel: "Temperature (°C)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        displayLegend: true,
      }
    );
  });
}

// Functions for temperature button

function fetchTemperatureData() {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const location = "35.166668,129.066666";
  const baseUrl = `https://api.weatherapi.com/v1/`;

  const currentDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const formattedYesterdayDate = yesterdayDate.toISOString().split("T")[0];

  // Fetch current temperature
  $.ajax({
    url: `${baseUrl}current.json`,
    method: "GET",
    data: { key: apiKey, q: location },
    success: function (response) {
      const currentTemp = response.current.temp_c;
      $("#value-1").text(`${currentTemp}°C`);

      renderChart(
        "temp-history-chart", // Canvas ID
        "bar", // Chart type
        dates, // Labels
        temps, // Data
        {
          chartTitle: "Today's Temperature",
          datasetLabel: "Temperature (°C)",
          xAxisLabel: "Time of Day",
          yAxisLabel: "Temperature (°C)",
          backgroundColor: colors,
          borderColor: "rgba(255, 99, 132, 1)",
          displayLegend: true,
        }
      );

      // Fetch yesterday's and 7-day historical data
      fetchHistoricalTemperatureData(formattedCurrentDate, 7);
    },
    error: function (error) {
      console.error("Error fetching current temperature:", error);
    },
  });
}

function fetchHistoricalTemperatureData(startDate, days) {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const location = "35.166668,129.066666";
  const baseUrl = `https://api.weatherapi.com/v1/history.json`;

  let dates = [];
  let temps = [];
  let requests = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];

    const request = $.ajax({
      url: baseUrl,
      method: "GET",
      data: { key: apiKey, q: location, dt: formattedDate },
      success: function (response) {
        dates.push(response.forecast.forecastday[0].date);
        temps.push(response.forecast.forecastday[0].day.avgtemp_c);
      },
      error: function (error) {
        console.error("Error fetching historical temperature:", error);
      },
    });

    requests.push(request);
  }

  $.when(...requests).done(function () {
    // Sort data from least recent to most recent
    const sortedData = dates
      .map((date, index) => ({ date, temp: temps[index] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const sortedDates = sortedData.map((entry) => entry.date);
    const sortedTemps = sortedData.map((entry) => entry.temp);

    // Update the chart for 7-day temperature history
    renderChart("temp-history-chart", "bar", sortedDates, sortedTemps, {
      chartTitle: "Temperature Over the Last 7 Days",
      datasetLabel: "Temperature (°C)",
      xAxisLabel: "Date",
      yAxisLabel: "Temperature (°C)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
    });
  });
}
