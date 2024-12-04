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
      const height = container.clientHeight;

      canvas.width = width;
      canvas.height = height;
    });
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
});
