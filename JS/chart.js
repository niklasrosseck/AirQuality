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
