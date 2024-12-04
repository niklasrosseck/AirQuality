// Functions for dashboard
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainSection = document.querySelector(".main-section");

  // Toggle the 'active' class on the sidebar and main section
  sidebar.classList.toggle("active");
  mainSection.classList.toggle("sidebar-active");
}

function updateSite(name, latitude, longitude) {
  const messageElement = document.querySelector(".welcome-message");
  messageElement.textContent = `Here's an overview of the air quality in ${name} today`;

  updateWeather(latitude, longitude);
  update7daypollution(latitude, longitude);
  updatePollution(latitude, longitude);
  updateTomorrowpollution(latitude, longitude);
  updateYesterdaypollution(latitude, longitude);
  renderHourlyData(latitude, longitude);
  renderSevenDayData(latitude, longitude);
}
