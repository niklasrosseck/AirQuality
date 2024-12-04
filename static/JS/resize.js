document.addEventListener("DOMContentLoaded", function () {
  function resizeCanvas() {
    const containers = document.querySelectorAll(".canvas-container");

    containers.forEach((container) => {
      const canvas = container.querySelector("canvas");

      if (!canvas) {
        console.error("Canvas not found in the container");
        return;
      }

      const width = container.clientWidth;
      const height = (width / 16) * 9;

      canvas.width = width;
      canvas.height = height;

      if (canvas.chart) {
        canvas.chart.resize();
      }
    });
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
});
