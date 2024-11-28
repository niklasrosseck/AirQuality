// Functions for dashboard

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
      $("#value-1").text(`${temperature}°C`);
      $("#value-2").text(`${humidity}%`);
      $("#value-3").text(`${pm2_5} µg/m³`);
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
      const colors = temps.map((temp) => getColorForTemperature(temp));
      renderChart("temp-history-chart", "bar", dates, temps, {
        chartTitle: "Today's Temperature",
        datasetLabel: "Temperature (°C)",
        xAxisLabel: "Time of Day",
        yAxisLabel: "Temperature (°C)",
        backgroundColor: colors,
        borderColor: "rgba(255, 99, 132, 1)",
        displayLegend: true,
      });

      renderChart("humidity-history-chart", "line", dates, humidities, {
        chartTitle: "Today's Humidity",
        datasetLabel: "Humidity (°C)",
        xAxisLabel: "Time of Day",
        yAxisLabel: "Humidity (°C)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        displayLegend: true,
      });
    },
    error: function (error) {
      console.error("Error fetching historical data", error);
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

function fetchAndUpdateData() {
  const apiKey = "e2a14997ca28418cb8c105717241311";
  const location = "35.166668,129.066666";
  const baseUrl = `https://api.weatherapi.com/v1`;

  // Fetch current data
  $.ajax({
    url: `${baseUrl}/current.json`,
    method: "GET",
    data: { key: apiKey, q: location, aqi: "yes" },
    success: (response) => {
      const currentTemp = response.current.temp_c;
      const currentHumidity = response.current.humidity;
      const currentPM2_5 = response.current.air_quality.pm2_5;

      // Update current values
      $("#value-temp").text(`${currentTemp}°C`);
      $("#value-humidity").text(`${currentHumidity}%`);
      $("#value-pm2_5").text(`${currentPM2_5.toFixed(2)} µg/m³`);

      // Update the current details section
      $("#current-temp").text(`Current: ${currentTemp}°C`);
      $("#current-hum").text(`Current: ${currentHumidity}%`);
    },
    error: (err) => console.error(err),
  });

  // Fetch hourly data for today
  const hourlyDates = [];
  const hourlyTemps = [];
  const hourlyHum = [];
  $.ajax({
    url: `${baseUrl}/history.json`,
    method: "GET",
    data: {
      key: apiKey,
      q: location,
      dt: new Date().toISOString().split("T")[0],
    },
    success: (response) => {
      // Extract hourly data
      response.forecast.forecastday[0].hour.forEach((hour) => {
        hourlyDates.push(hour.time); // Time of the hour
        hourlyTemps.push(hour.temp_c); // Hourly temperature
        hourlyHum.push(hour.humidity); // Hourly Humidity
      });

      // Map temperatures to colors
      const colors = hourlyTemps.map((temp) => getColorForTemperature(temp));

      // Render hourly Temperature chart
      renderChart("bar-temp-today-chart", "bar", hourlyDates, hourlyTemps, {
        chartTitle: "Today's Temperature",
        datasetLabel: "Temperature (°C)",
        xAxisLabel: "Time of Day",
        yAxisLabel: "Temperature (°C)",
        backgroundColor: colors,
        borderColor: "rgba(255, 99, 132, 1)",
        displayLegend: true,
      });

      // Render hourly Humidity chart
      renderChart("hum-today-chart", "line", hourlyDates, hourlyHum, {
        chartTitle: "Today's Humidity",
        datasetLabel: "Humidity (%)",
        xAxisLabel: "Time of Day",
        yAxisLabel: "Humidity (%)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        displayLegend: true,
      });
    },
    error: (err) => console.error("Error fetching hourly data:", err),
  });

  // Fetch historical data for 7-day averages
  const dates = [];
  const temps = [];
  const hums = [];
  const promises = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];

    const request = $.ajax({
      url: `${baseUrl}/history.json`,
      method: "GET",
      data: { key: apiKey, q: location, dt: formattedDate },
      success: (response) => {
        dates.push(response.forecast.forecastday[0].date);
        temps.push(response.forecast.forecastday[0].day.avgtemp_c);
        hums.push(response.forecast.forecastday[0].day.avghumidity);
      },
    });

    promises.push(request);
  }

  // Update averages and charts once all data is fetched
  $.when(...promises).done(() => {
    // Combine dates and temps into a single array of objects
    const dateTempPairs = dates.map((date, index) => ({
      date,
      temp: temps[index],
    }));

    const dateHumPairs = dates.map((date, index) => ({
      date,
      hum: hums[index],
    }));

    // Sort by date (ascending)
    dateTempPairs.sort((a, b) => new Date(a.date) - new Date(b.date));
    dateHumPairs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Separate the sorted pairs back into dates and temps
    const sortedDates = dateTempPairs.map((pair) => pair.date);
    const sortedTemps = dateTempPairs.map((pair) => pair.temp);
    const sortedHums = dateHumPairs.map((pair) => pair.hum);

    // Calculate 7-day average
    const avg7DaysTemp = (
      sortedTemps.reduce((a, b) => a + b, 0) / sortedTemps.length
    ).toFixed(2);

    const avg7DaysHum = (
      sortedHums.reduce((a, b) => a + b, 0) / sortedHums.length
    ).toFixed(2);

    // Update detail values
    $("#yesterday-temp").text(`Yesterday: ${sortedTemps[5]}°C`);
    $("#avg-7days-temp").text(`7-day Avg: ${avg7DaysTemp}°C`);

    $("#yesterday-hum").text(`Yesterday: ${sortedHums[5]}%`);
    $("#avg-7days-hum").text(`7-day Avg: ${avg7DaysHum}%`);

    // Map temperatures to colors
    const colors7 = sortedTemps.map((temp) => getColorForTemperature(temp));

    // Render 7-day average temperature chart
    renderChart("bar-temp-7days-chart", "bar", sortedDates, sortedTemps, {
      chartTitle: "Temperature Average over the last 7 days",
      datasetLabel: "Average Temperature (°C)",
      xAxisLabel: "Day",
      yAxisLabel: "Average Temperature (°C)",
      backgroundColor: colors7,
      borderColor: "rgba(255, 99, 132, 1)",
      displayLegend: true,
    });

    // Render 7-day average humidity chart
    renderChart("hum-7days-chart", "line", sortedDates, sortedHums, {
      chartTitle: "Humidity Average over the last 7 days",
      datasetLabel: "Average Humidity (%)",
      xAxisLabel: "Day",
      yAxisLabel: "Average Humidity (%)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      displayLegend: true,
    });
  });
}

$(document).ready(() => {
  fetchAndUpdateData();
  fetchAirPollutionData();
});

function fetchAirPollutionData() {
  const apiKey = "fd488f47838f7b8ad07a3418c68837ce";
  const lat = "35.166668";
  const lon = "129.066666";
  const baseUrl = "https://api.openweathermap.org/data/2.5/air_pollution";

  let hourlyData = {};
  let avg7DaysData = {};

  // Get current pollution data
  $.ajax({
    url: `${baseUrl}`,
    method: "GET",
    data: { lat, lon, appid: apiKey },
    success: (response) => {
      const { pm2_5, pm10, co, no2, o3, so2, nh3 } =
        response.list[0].components;

      // Update UI for current data
      $("#current-pm2").text(`Current: ${pm2_5} µg/m³`);
      $("#current-pm10").text(`Current: ${pm10} µg/m³`);
      $("#current-co").text(`Current: ${co} ppm`);
      $("#current-no2").text(`Current: ${no2} ppb`);
      $("#current-o3").text(`Current: ${o3} µg/m³`);
      $("#current-so2").text(`Current: ${so2} ppb`);
      $("#current-nh3").text(`Current: ${nh3} ppm`);
    },
    error: (err) => console.error("Error fetching current pollution data", err),
  });

  // Calculate tomorrow's date
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  $.ajax({
    url: `${baseUrl}/forecast`,
    method: "GET",
    data: { lat, lon, appid: apiKey },
    success: (response) => {
      // Extract data for today
      const hourlyToday = response.list.filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        return (
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      });

      // Extract data for tomorrow
      const tomorrowData = response.list.filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        return (
          itemDate.getDate() === tomorrow.getDate() &&
          itemDate.getMonth() === tomorrow.getMonth() &&
          itemDate.getFullYear() === tomorrow.getFullYear()
        );
      });

      hourlyData = extractHourlyData(hourlyToday);

      // Create charts for every component
      createAirPollutionChartsHourly(hourlyData);

      // Calculate averages for tomorrow
      const avgPM2_5 = (
        tomorrowData.reduce((sum, item) => sum + item.components.pm2_5, 0) /
        tomorrowData.length
      ).toFixed(2);

      const avgPM10 = (
        tomorrowData.reduce((sum, item) => sum + item.components.pm10, 0) /
        tomorrowData.length
      ).toFixed(2);

      const avgNO2 = (
        tomorrowData.reduce((sum, item) => sum + item.components.no2, 0) /
        tomorrowData.length
      ).toFixed(2);

      const avgNH3 = (
        tomorrowData.reduce((sum, item) => sum + item.components.nh3, 0) /
        tomorrowData.length
      ).toFixed(2);

      const avgCO = (
        tomorrowData.reduce((sum, item) => sum + item.components.co, 0) /
        tomorrowData.length
      ).toFixed(2);

      const avgSO2 = (
        tomorrowData.reduce((sum, item) => sum + item.components.so2, 0) /
        tomorrowData.length
      ).toFixed(2);

      // Update UI with tomorrows averages
      $("#forecast-avg-pm2").text(`Tomorrows Average PM2.5: ${avgPM2_5} µg/m³`);
      $("#forecast-avg-pm10").text(`Tomorrows Average PM10: ${avgPM10} µg/m³`);
      $("#forecast-avg-no2").text(`Tomorrows Average NO2: ${avgNO2} ppb`);
      $("#forecast-avg-nh3").text(`Tomorrows Average NH3: ${avgNH3} ppb`);
      $("#forecast-avg-co").text(`Tomorrows Average CO: ${avgCO} ppm`);
      $("#forecast-avg-so2").text(`Tomorrows Average SO2: ${avgSO2} ppb`);
    },
    error: (err) =>
      console.error("Error fetching forecast pollution data", err),
  });

  // Yesterday's data

  // Calculate yesterday's timestamp
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  const yesterdayTimestamp = Math.floor(yesterday.getTime() / 1000);

  $.ajax({
    url: `${baseUrl}/history`,
    method: "GET",
    data: {
      lat,
      lon,
      start: yesterdayTimestamp,
      end: yesterdayTimestamp + 86400,
      appid: apiKey,
    },
    success: (response) => {
      const pollutionData = response.list;
      if (pollutionData.length > 0) {
        const avgPM2_5 = (
          pollutionData.reduce((sum, item) => sum + item.components.pm2_5, 0) /
          pollutionData.length
        ).toFixed(2);

        const avgPM10 = (
          pollutionData.reduce((sum, item) => sum + item.components.pm10, 0) /
          pollutionData.length
        ).toFixed(2);

        const avgNO2 = (
          pollutionData.reduce((sum, item) => sum + item.components.no2, 0) /
          pollutionData.length
        ).toFixed(2);

        const avgNH3 = (
          pollutionData.reduce((sum, item) => sum + item.components.nh3, 0) /
          pollutionData.length
        ).toFixed(2);

        const avgCO = (
          pollutionData.reduce((sum, item) => sum + item.components.co, 0) /
          pollutionData.length
        ).toFixed(2);

        const avgSO2 = (
          pollutionData.reduce((sum, item) => sum + item.components.so2, 0) /
          pollutionData.length
        ).toFixed(2);

        // Update UI for yesterday's data
        $("#yesterday-pm2").text(
          `Yesterday's Average PM2.5: ${avgPM2_5} µg/m³`
        );
        $("#yesterday-pm10").text(`Yesterday's Average PM10: ${avgPM10} µg/m³`);
        $("#yesterday-no2").text(`Yesterday's Average NO2: ${avgNO2} ppb`);
        $("#yesterday-nh3").text(`Yesterday's Average NH3: ${avgNH3} ppb`);
        $("#yesterday-co").text(`Yesterday's Average CO: ${avgCO} ppm`);
        $("#yesterday-so2").text(`Yesterday's Average SO2: ${avgSO2} ppb`);
      }
    },
    error: (err) =>
      console.error("Error fetching yesterday's pollution data", err),
  });

  // Get historical pollution data
  const end = Math.floor(Date.now() / 1000); // Current time in UNIX format
  const start = end - 7 * 24 * 60 * 60; // 7 days ago in UNIX format

  $.ajax({
    url: `${baseUrl}/history`,
    method: "GET",
    data: { lat, lon, start, end, appid: apiKey },
    success: (response) => {
      // Extract and calculate average pollution levels
      const historicalData = response.list.map((item) => ({
        time: new Date(item.dt * 1000).toLocaleString(),
        pm2_5: item.components.pm2_5,
        pm10: item.components.pm10,
        no2: item.components.no2,
        nh3: item.components.nh3,
        co: item.components.co,
        so2: item.components.so2,
      }));

      avg7DaysData = calculateAverages(response.list);
      console.log(avg7DaysData);
      createAirPollutionCharts7days(avg7DaysData);

      // Calculate averages for the last 7 days
      const totalPm2_5 = historicalData.reduce(
        (sum, data) => sum + data.pm2_5,
        0
      );

      const totalPm10 = historicalData.reduce(
        (sum, data) => sum + data.pm10,
        0
      );

      const totalNO2 = historicalData.reduce((sum, data) => sum + data.no2, 0);

      const totalNH3 = historicalData.reduce((sum, data) => sum + data.nh3, 0);

      const totalCO = historicalData.reduce((sum, data) => sum + data.co, 0);

      const totalSO2 = historicalData.reduce((sum, data) => sum + data.so2, 0);

      const avgPm2_5 = (totalPm2_5 / historicalData.length).toFixed(2);
      const avgPm10 = (totalPm10 / historicalData.length).toFixed(2);
      const avgNO2 = (totalNO2 / historicalData.length).toFixed(2);
      const avgNH3 = (totalNH3 / historicalData.length).toFixed(2);
      const avgCO = (totalCO / historicalData.length).toFixed(2);
      const avgSO2 = (totalSO2 / historicalData.length).toFixed(2);

      // Update UI with averages
      $("#avg-7days-pm2").text(`7-Day Avg PM2.5: ${avgPm2_5} µg/m³`);
      $("#avg-7days-pm10").text(`7-Day Avg PM10: ${avgPm10} µg/m³`);
      $("#avg-7days-no2").text(`7-Day Avg NO2: ${avgNO2} ppb`);
      $("#avg-7days-nh3").text(`7-Day Avg NH3: ${avgNH3} ppb`);
      $("#avg-7days-co").text(`7-Day Avg CO: ${avgCO} ppm`);
      $("#avg-7days-so2").text(`7-Day Avg SO2: ${avgSO2} ppb`);
    },
    error: (err) =>
      console.error("Error fetching historical pollution data", err),
  });
}

// Helper function to structure hourly data
function extractHourlyData(hourlyList) {
  const data = {
    pm2_5: [],
    pm10: [],
    no2: [],
    nh3: [],
    co: [],
    so2: [],
    labels: [],
  };

  hourlyList.forEach((item) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString();
    data.labels.push(time);
    data.pm2_5.push(item.components.pm2_5);
    data.pm10.push(item.components.pm10);
    data.no2.push(item.components.no2);
    data.nh3.push(item.components.nh3);
    data.co.push(item.components.co);
    data.so2.push(item.components.so2);
  });

  return data;
}

// Helper function to calculate 7-day averages
function calculateAverages(historicalList) {
  const dailyData = {};

  historicalList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        pm2_5: [],
        pm10: [],
        no2: [],
        nh3: [],
        co: [],
        so2: [],
      };
    }

    dailyData[dayKey].pm2_5.push(item.components.pm2_5);
    dailyData[dayKey].pm10.push(item.components.pm10);
    dailyData[dayKey].no2.push(item.components.no2);
    dailyData[dayKey].nh3.push(item.components.nh3);
    dailyData[dayKey].co.push(item.components.co);
    dailyData[dayKey].so2.push(item.components.so2);
  });

  const dailyAverages = {
    labels: [],
    pm2_5: [],
    pm10: [],
    no2: [],
    nh3: [],
    co: [],
    so2: [],
  };

  Object.keys(dailyData).forEach((dayKey) => {
    dailyAverages.labels.push(dayKey);

    dailyAverages.pm2_5.push(
      (
        dailyData[dayKey].pm2_5.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].pm2_5.length
      ).toFixed(2)
    );

    dailyAverages.pm10.push(
      (
        dailyData[dayKey].pm10.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].pm10.length
      ).toFixed(2)
    );

    dailyAverages.no2.push(
      (
        dailyData[dayKey].no2.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].no2.length
      ).toFixed(2)
    );

    dailyAverages.nh3.push(
      (
        dailyData[dayKey].nh3.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].nh3.length
      ).toFixed(2)
    );

    dailyAverages.co.push(
      (
        dailyData[dayKey].co.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].co.length
      ).toFixed(2)
    );

    dailyAverages.so2.push(
      (
        dailyData[dayKey].so2.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].so2.length
      ).toFixed(2)
    );
  });

  return dailyAverages;
}

function createAirPollutionChartsHourly(hourlyData) {
  const components = [
    { key: "pm2_5", name: "PM2.5", unit: "μg/m³" },
    { key: "pm10", name: "PM10", unit: "μg/m³" },
    { key: "no2", name: "NO₂", unit: "ppb" },
    { key: "nh3", name: "NH₃", unit: "ppb" },
    { key: "co", name: "CO", unit: "ppm" },
    { key: "so2", name: "SO₂", unit: "ppb" },
  ];

  components.forEach(({ key, name, unit }) => {
    renderChart(
      `${key}-today-chart`,
      "line",
      hourlyData.labels,
      hourlyData[key],
      {
        chartTitle: `${name} Levels Today`,
        xAxisLabel: "Time",
        yAxisLabel: `${name} (${unit})`,
        datasetLabel: `${name} (Hourly)`,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      }
    );
  });
}

function createAirPollutionCharts7days(avg7DaysData) {
  const components = [
    {
      key: "pm2_5",
      name: "PM2.5",
      unit: "μg/m³",
      thresholds: [10, 25, 50, 75],
    },
    {
      key: "pm10",
      name: "PM10",
      unit: "μg/m³",
      thresholds: [20, 50, 100, 200],
    },
    {
      key: "no2",
      name: "NO₂",
      unit: "ppb",
      thresholds: [40, 70, 150, 200],
    },
    {
      key: "nh3",
      name: "NH₃",
      unit: "ppb",
      thresholds: [100, 200, 400, 800],
    },
    {
      key: "co",
      name: "CO",
      unit: "ppm",
      thresholds: [4400, 9400, 12400, 15400],
    },
    {
      key: "so2",
      name: "SO₂",
      unit: "ppb",
      thresholds: [20, 80, 250, 350],
    },
  ];

  components.forEach(({ key, name, unit, thresholds }) => {
    // Determine bar colors based on thresholds
    const barColors = avg7DaysData[key].map((value) =>
      getColorForValue(value, thresholds)
    );

    renderChart(
      `${key}-7days-chart`,
      "bar",
      avg7DaysData.labels,
      avg7DaysData[key],
      {
        chartTitle: `${name} 7-Day Average`,
        xAxisLabel: "Date",
        yAxisLabel: `${name} (${unit})`,
        backgroundColor: barColors,
        borderColor: "rgba(255, 99, 132, 1)",
      }
    );
  });
}

// Green, Yellow, Orange, Red, Purple representing Good, Fair, Moderate, Poor and very Poor Air Quality
const pollutantcolors = ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c", "#8e44ad"];

// Function to determine color based on value and thresholds
function getColorForValue(value, thresholds) {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      return pollutantcolors[i];
    }
  }
  return pollutantcolors[pollutantcolors.length - 1]; // Return the last color if above all thresholds
}
