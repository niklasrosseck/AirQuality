// JavaScript to initialize the Temperature Chart
const ctxTemp = document.getElementById("temperatureChart").getContext("2d");
new Chart(ctxTemp, {
  type: "line",
  data: {
    labels: [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Temperature",
        data: [25, 26, 27, 28, 29, 30, 28, 27, 29, 30, 31],
        borderColor: "#007bff",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// JavaScript to initialize the Humidity Chart
const ctxHum = document.getElementById("humidityChart").getContext("2d");
new Chart(ctxHum, {
  type: "line",
  data: {
    labels: [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Humidity",
        data: [60, 62, 63, 64, 65, 66, 64, 63, 65, 66, 67],
        borderColor: "#17a2b8",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// Trying out the API
