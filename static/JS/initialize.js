let currentCity = JSON.parse(localStorage.getItem("currentCity")) || {
  name: "Busan",
  country: "South Korea",
  latitude: 35.1796,
  longitude: 129.0756,
};

window.currentCity = currentCity;

window.setCurrentCity = function (city) {
  window.currentCity = city;

  localStorage.setItem("currentCity", JSON.stringify(city));
  console.log("Current city set to:", city);
};

window.getCurrentCity = function () {
  return window.currentCity;
};
