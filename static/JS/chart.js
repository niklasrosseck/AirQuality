function renderChart(canvasId, chartType, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Removing any existing chart from the canvas to prevent overlay issues
  if (window[canvasId] && window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  // Creating a new chart
  window[canvasId] = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [
        {
          label: options.datasetLabel || "Dataset",
          data: data,
          backgroundColor: options.backgroundColor || "rgba(75, 192, 192, 0.2)",
          borderColor: options.borderColor || "rgba(75, 192, 192, 1)",
          borderWidth: options.borderWidth || 1,
          fill: options.fill || false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: options.displayLegend || false,
        },
        title: {
          display: true,
          text: options.chartTitle || "Chart",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: !!options.xAxisLabel,
            text: options.xAxisLabel || "",
          },
        },
        y: {
          display: true,
          title: {
            display: !!options.yAxisLabel,
            text: options.yAxisLabel || "",
          },
        },
      },
    },
  });
}

// Functions for coloring the charts
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

function createDonutChart(data) {
  const ctx = document.getElementById("pollutionDonutChart").getContext("2d");

  const chartData = {
    labels: ["PM2.5", "PM10", "CO", "NO2", "O3", "SO2", "NH3"],
    datasets: [
      {
        data: [
          data.pm2_5,
          data.pm10,
          data.co,
          data.no2,
          data.o3,
          data.so2,
          data.nh3,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // PM2.5
          "rgba(54, 162, 235, 0.6)", // PM10
          "rgba(255, 206, 86, 0.6)", // CO
          "rgba(75, 192, 192, 0.6)", // NO2
          "rgba(153, 102, 255, 0.6)", // O3
          "rgba(255, 159, 64, 0.6)", // SO2
          "rgba(255, 99, 64, 0.6)", // NH3
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value} ${getUnit(
              tooltipItem.label
            )}`;
          },
        },
      },
    },
  };

  new Chart(ctx, {
    type: "doughnut",
    data: chartData,
    options: chartOptions,
  });
}

function getUnit(label) {
  switch (label) {
    case "PM2.5":
    case "PM10":
    case "O3":
      return "µg/m³";
    case "NO2":
    case "SO2":
      return "ppb";
    case "CO":
    case "NH3":
      return "ppm";
    default:
      return "";
  }
}
