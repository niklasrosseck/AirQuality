$(document).ready(function () {
  updatePollution("35.166668", "129.066666");
  updateTomorrowpollution("35.166668", "129.066666");
  updateYesterdaypollution("35.166668", "129.066666");
  update7daypollution("35.166668", "129.066666");
});

const pollutantIcons = ["😊", "😐", "😷", "🤒", "🆘"];

function getIconForValue(value, thresholds) {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      return pollutantIcons[i];
    }
  }
  return pollutantIcons[pollutantIcons.length - 1];
}

const stat_pollutantcolors = [
  "rgba(46, 204, 113, 0.4)", // Good (Green)
  "rgba(241, 196, 15, 0.4)", // Fair (Yellow)
  "rgba(230, 126, 34, 0.4)", // Moderate (Orange)
  "rgba(231, 76, 60, 0.4)", // Poor (Red)
  "rgba(142, 68, 173, 0.4)", // Very Poor (Purple)
];

function getStatColorForValue(value, thresholds) {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      return stat_pollutantcolors[i];
    }
  }
  return stat_pollutantcolors[stat_pollutantcolors.length - 1];
}

function updatePollution(latitude, longitude) {
  $.get(
    `/pollution_data?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
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
        {
          key: "o3",
          name: "O3",
          unit: "μg/m³",
          thresholds: [60, 100, 140, 180],
        },
      ];

      components.forEach((component) => {
        const value = data[component.key];
        const color = getStatColorForValue(value, component.thresholds);
        const icon = getIconForValue(value, component.thresholds);

        $(`#value-${component.key}`).text(`${value} ${component.unit}`);

        const statCard = $(`#value-${component.key}`).closest(".stat-card");
        statCard.css("background-color", color);
        statCard.find(".status-icon").text(icon);
      });

      $("#current-pm2").text(`Current: ${data.pm2_5} µg/m³`);
      $("#current-pm10").text(`Current: ${data.pm10} µg/m³`);
      $("#current-co").text(`Current: ${data.co} ppm`);
      $("#current-no2").text(`Current: ${data.no2} ppb`);
      $("#current-o3").text(`Current: ${data.o3} µg/m³`);
      $("#current-so2").text(`Current: ${data.so2} ppb`);
      $("#current-nh3").text(`Current: ${data.nh3} ppm`);

      createDonutChart(data);
    }
  );
}

function updateYesterdaypollution(latitude, longitude) {
  $.get(
    `/historical_pollution?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
      $("#yesterday-pm2").text(
        `Yesterday's Average PM2.5: ${data.avg_pm2_5} µg/m³`
      );
      $("#yesterday-pm10").text(
        `Yesterday's Average PM10: ${data.avg_pm10} µg/m³`
      );
      $("#yesterday-no2").text(`Yesterday's Average NO2: ${data.avg_no2} ppb`);
      $("#yesterday-nh3").text(`Yesterday's Average NH3: ${data.avg_nh3} ppb`);
      $("#yesterday-co").text(`Yesterday's Average CO: ${data.avg_co} ppm`);
      $("#yesterday-so2").text(`Yesterday's Average SO2: ${data.avg_so2} ppb`);
      $("#yesterday-o3").text(`Yesterday's Average O3: ${data.avg_o3} µg/m³`);
    }
  );
}

function update7daypollution(latitude, longitude) {
  $.get(
    `/historical_7day_pollution?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
      const { historical_data, avg_pollution } = data;
      avg7DaysData = calculateAverages(historical_data);
      createAirPollutionCharts7days(avg7DaysData);
      $("#avg-7days-pm2").text(
        `7-Day Avg PM2.5: ${avg_pollution.avg_pm2_5} µg/m³`
      );
      $("#avg-7days-pm10").text(
        `7-Day Avg PM10: ${avg_pollution.avg_pm10} µg/m³`
      );
      $("#avg-7days-no2").text(`7-Day Avg NO2: ${avg_pollution.avg_no2} ppb`);
      $("#avg-7days-nh3").text(`7-Day Avg NH3: ${avg_pollution.avg_nh3} ppb`);
      $("#avg-7days-co").text(`7-Day Avg CO: ${avg_pollution.avg_co} ppm`);
      $("#avg-7days-so2").text(`7-Day Avg SO2: ${avg_pollution.avg_so2} ppb`);
      $("#avg-7days-o3").text(`7-Day Avg O3: ${avg_pollution.avg_o3} µg/m³`);
    }
  );
}

function updateTomorrowpollution(latitude, longitude) {
  $.get(
    `/forecast_pollution?latitude=${latitude}&longitude=${longitude}`,
    function (data) {
      const { hourly_data, avg_pollution } = data;

      $("#forecast-avg-pm2").text(
        `Tomorrows Average PM2.5: ${avg_pollution.avg_pm2_5} µg/m³`
      );
      $("#forecast-avg-pm10").text(
        `Tomorrows Average PM10: ${avg_pollution.avg_pm10} µg/m³`
      );
      $("#forecast-avg-no2").text(
        `Tomorrows Average NO2: ${avg_pollution.avg_no2} ppb`
      );
      $("#forecast-avg-nh3").text(
        `Tomorrows Average NH3: ${avg_pollution.avg_nh3} ppb`
      );
      $("#forecast-avg-co").text(
        `Tomorrows Average CO: ${avg_pollution.avg_co} ppm`
      );
      $("#forecast-avg-so2").text(
        `Tomorrows Average SO2: ${avg_pollution.avg_so2} ppb`
      );
      $("#forecast-avg-o3").text(
        `Tomorrows Average O3: ${avg_pollution.avg_o3} µg/m³`
      );

      const hourlyData = extractHourlyData(hourly_data);

      createAirPollutionChartsHourly(hourlyData);
    }
  );
}

function extractHourlyData(hourlyList) {
  const data = {
    pm2_5: [],
    pm10: [],
    no2: [],
    nh3: [],
    co: [],
    so2: [],
    o3: [],
    labels: [],
  };

  hourlyList.forEach((item) => {
    const time = new Date(item.time * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    data.labels.push(time);
    data.pm2_5.push(item.pm2_5);
    data.pm10.push(item.pm10);
    data.no2.push(item.no2);
    data.nh3.push(item.nh3);
    data.co.push(item.co);
    data.so2.push(item.so2);
    data.o3.push(item.o3);
  });

  return data;
}

function createAirPollutionChartsHourly(hourlyData) {
  const components = [
    { key: "pm2_5", name: "PM2.5", unit: "μg/m³" },
    { key: "pm10", name: "PM10", unit: "μg/m³" },
    { key: "no2", name: "NO₂", unit: "ppb" },
    { key: "nh3", name: "NH₃", unit: "ppb" },
    { key: "co", name: "CO", unit: "ppm" },
    { key: "so2", name: "SO₂", unit: "ppb" },
    { key: "o3", name: "O₃", unit: "μg/m³" },
  ];

  components.forEach(({ key, name, unit }) => {
    renderChart(
      `${key}-tomorrow-chart`,
      "line",
      hourlyData.labels,
      hourlyData[key],
      {
        chartTitle: `${name} Levels Tomorrow`,
        xAxisLabel: "Time",
        yAxisLabel: `${name} (${unit})`,
        datasetLabel: `${name} (Hourly)`,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      }
    );
  });
}

function calculateAverages(historicalList) {
  const dailyData = {};

  historicalList.forEach((item) => {
    const timeString = item.time;
    const dayKey = timeString.split(" ")[0];

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        pm2_5: [],
        pm10: [],
        no2: [],
        nh3: [],
        co: [],
        so2: [],
        o3: [],
      };
    }

    dailyData[dayKey].pm2_5.push(item.pm2_5);
    dailyData[dayKey].pm10.push(item.pm10);
    dailyData[dayKey].no2.push(item.no2);
    dailyData[dayKey].nh3.push(item.nh3);
    dailyData[dayKey].co.push(item.co);
    dailyData[dayKey].so2.push(item.so2);
    dailyData[dayKey].o3.push(item.o3);
  });

  const dailyAverages = {
    labels: [],
    pm2_5: [],
    pm10: [],
    no2: [],
    nh3: [],
    co: [],
    so2: [],
    o3: [],
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

    dailyAverages.o3.push(
      (
        dailyData[dayKey].o3.reduce((sum, val) => sum + val, 0) /
        dailyData[dayKey].o3.length
      ).toFixed(2)
    );
  });

  return dailyAverages;
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
    {
      key: "o3",
      name: "O3",
      unit: "μg/m³",
      thresholds: [60, 100, 140, 180],
    },
  ];

  components.forEach(({ key, name, unit, thresholds }) => {
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

function getColorForValue(value, thresholds) {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      return pollutantcolors[i];
    }
  }
  return pollutantcolors[pollutantcolors.length - 1];
}
