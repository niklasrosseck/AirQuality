// Here are all functions that are used for the CO2 prediction website

$(document).ready(function () {
  updatePrediction();
  updateGraphs();
});

function exportCSV() {
  window.location.href = "/csv_data";
}

function updatePrediction() {
  const modelName = $("#model-select").val();

  $.ajax({
    url: "/predict_co2",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ model_name: modelName }),
    success: function (data) {
      const co2Category = data.co2_category;
      $("#predicted-co2").text(`${data.predicted_co2} ppm`);

      updateCO2Category(co2Category);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Failed to fetch prediction.");
    },
  });
}

function loadPredictionGraph(modelName) {
  $.ajax({
    url: `/get_predictions/${modelName}`,
    type: "GET",
    success: function (data) {
      const rows = data.split("\n").slice(1);
      const actual = [];
      const predicted = [];
      rows.forEach((row) => {
        const cols = row.split(",");
        if (cols.length === 2) {
          actual.push(parseFloat(cols[0]));
          predicted.push(parseFloat(cols[1]));
        }
      });

      const trace1 = {
        x: actual,
        y: predicted,
        mode: "markers",
        name: "Actual vs Predicted",
      };

      const layout = {
        title: `${modelName} - Actual vs Predicted CO2 Values`,
        xaxis: { title: "Actual" },
        yaxis: { title: "Predicted" },
      };

      Plotly.newPlot("co2-graph", [trace1], layout);
    },
    error: function (error) {
      console.error("Error loading prediction data:", error);
    },
  });
}

function loadLossGraph(modelName) {
  $.ajax({
    url: `/get_loss_data/${modelName}`,
    type: "GET",
    success: function (data) {
      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      const trace1 = {
        x: Array.from({ length: data.loss.length }, (_, i) => i + 1),
        y: data.loss,
        mode: "lines",
        name: "Training Loss",
      };

      const trace2 = {
        x: Array.from({ length: data.val_loss.length }, (_, i) => i + 1),
        y: data.val_loss,
        mode: "lines",
        name: "Validation Loss",
      };

      const layout = {
        title: `${modelName} - Training vs Validation Loss`,
        xaxis: { title: "Epochs" },
        yaxis: { title: "Loss" },
      };

      Plotly.newPlot("loss-graph", [trace1, trace2], layout);
    },
    error: function (error) {
      console.error("Error loading loss data:", error);
    },
  });
}

function updateGraphs() {
  const modelName = document.getElementById("model-select").value;

  loadLossGraph(modelName);
  loadPredictionGraph(modelName);
}

function updateCO2Category(category) {
  const co2ValueBox = document.getElementById("co2-value");

  co2ValueBox.classList.remove("low", "medium", "high", "very-high");

  if (category === "Low") {
    co2ValueBox.classList.add("low");
  } else if (category === "Medium") {
    co2ValueBox.classList.add("medium");
  } else if (category === "High") {
    co2ValueBox.classList.add("high");
  } else if (category === "Very High") {
    co2ValueBox.classList.add("very-high");
  }
}
