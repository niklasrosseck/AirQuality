$(document).ready(function () {
  $("#city-search").autocomplete({
    source: cities.map((city) => `${city.name}, ${city.country}`),
    minLength: 1,
    select: function (event, ui) {
      $("#city-search").val(ui.item.label);
      fetchCityCoordinates(ui.item.label);
    },
  });

  $("#search-button").on("click", function () {
    const cityName = $("#city-search").val();
    fetchCityCoordinates(cityName);
  });

  function fetchCityCoordinates(cityName) {
    const city = cities.find((c) => {
      const fullName = `${c.name}, ${c.country}`;
      return fullName.toLowerCase() === cityName.toLowerCase();
    });

    if (city) {
      window.setCurrentCity(city);
      updateSite(city.name, city.latitude, city.longitude);
    } else {
      alert("City not found.");
    }
  }
});

// Using hardcoded cities because I could not get the database to work
// and the database is also nearly 1GB in size which comes close to the limit of Github

const cities = [
  // Top 10 cities in South Korea
  {
    name: "Seoul",
    country: "South Korea",
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    name: "Busan",
    country: "South Korea",
    latitude: 35.1796,
    longitude: 129.0756,
  },
  {
    name: "Incheon",
    country: "South Korea",
    latitude: 37.4563,
    longitude: 126.7052,
  },
  {
    name: "Daegu",
    country: "South Korea",
    latitude: 35.8722,
    longitude: 128.6025,
  },
  {
    name: "Daejeon",
    country: "South Korea",
    latitude: 36.3504,
    longitude: 127.3845,
  },
  {
    name: "Gwangju",
    country: "South Korea",
    latitude: 35.1595,
    longitude: 126.8526,
  },
  {
    name: "Suwon",
    country: "South Korea",
    latitude: 37.2636,
    longitude: 127.0286,
  },
  {
    name: "Ulsan",
    country: "South Korea",
    latitude: 35.5384,
    longitude: 129.3114,
  },
  {
    name: "Changwon",
    country: "South Korea",
    latitude: 35.2284,
    longitude: 128.6811,
  },
  {
    name: "Goyang",
    country: "South Korea",
    latitude: 37.6584,
    longitude: 126.832,
  },

  // Famous cities around the world
  { name: "Tokyo", country: "Japan", latitude: 35.6895, longitude: 139.6917 },
  { name: "Osaka", country: "Japan", latitude: 34.6937, longitude: 135.5023 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  {
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  { name: "Berlin", country: "Germany", latitude: 52.52, longitude: 13.405 },
  { name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
  { name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964 },
  { name: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173 },
  { name: "Beijing", country: "China", latitude: 39.9042, longitude: 116.4074 },
  {
    name: "Shanghai",
    country: "China",
    latitude: 31.2304,
    longitude: 121.4737,
  },
  { name: "New York", country: "USA", latitude: 40.7128, longitude: -74.006 },
  {
    name: "Los Angeles",
    country: "USA",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  { name: "Chicago", country: "USA", latitude: 41.8781, longitude: -87.6298 },
  { name: "Houston", country: "USA", latitude: 29.7604, longitude: -95.3698 },
  {
    name: "San Francisco",
    country: "USA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  { name: "Miami", country: "USA", latitude: 25.7617, longitude: -80.1918 },
  { name: "Toronto", country: "Canada", latitude: 43.6511, longitude: -79.347 },
  {
    name: "Vancouver",
    country: "Canada",
    latitude: 49.2827,
    longitude: -123.1207,
  },
  {
    name: "Mexico City",
    country: "Mexico",
    latitude: 19.4326,
    longitude: -99.1332,
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    latitude: -22.9068,
    longitude: -43.1729,
  },
  {
    name: "São Paulo",
    country: "Brazil",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    name: "Buenos Aires",
    country: "Argentina",
    latitude: -34.6037,
    longitude: -58.3816,
  },
  {
    name: "Cape Town",
    country: "South Africa",
    latitude: -33.9249,
    longitude: 18.4241,
  },
  {
    name: "Johannesburg",
    country: "South Africa",
    latitude: -26.2041,
    longitude: 28.0473,
  },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  {
    name: "Istanbul",
    country: "Turkey",
    latitude: 41.0082,
    longitude: 28.9784,
  },
  { name: "Athens", country: "Greece", latitude: 37.9838, longitude: 23.7275 },
  {
    name: "Lisbon",
    country: "Portugal",
    latitude: 38.7223,
    longitude: -9.1393,
  },
  { name: "Vienna", country: "Austria", latitude: 48.2082, longitude: 16.3738 },
  {
    name: "Prague",
    country: "Czech Republic",
    latitude: 50.0755,
    longitude: 14.4378,
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    name: "Brussels",
    country: "Belgium",
    latitude: 50.8503,
    longitude: 4.3517,
  },
  {
    name: "Zurich",
    country: "Switzerland",
    latitude: 47.3769,
    longitude: 8.5417,
  },
  {
    name: "Stockholm",
    country: "Sweden",
    latitude: 59.3293,
    longitude: 18.0686,
  },
  { name: "Oslo", country: "Norway", latitude: 59.9139, longitude: 10.7522 },
  {
    name: "Helsinki",
    country: "Finland",
    latitude: 60.1695,
    longitude: 24.9354,
  },
  {
    name: "Copenhagen",
    country: "Denmark",
    latitude: 55.6761,
    longitude: 12.5683,
  },
  {
    name: "Sydney",
    country: "Australia",
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    name: "Melbourne",
    country: "Australia",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    name: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
  },
  { name: "Dubai", country: "UAE", latitude: 25.276987, longitude: 55.296249 },
  {
    name: "Bangkok",
    country: "Thailand",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    name: "Kuala Lumpur",
    country: "Malaysia",
    latitude: 3.139,
    longitude: 101.6869,
  },
  { name: "Delhi", country: "India", latitude: 28.7041, longitude: 77.1025 },
  { name: "Mumbai", country: "India", latitude: 19.076, longitude: 72.8777 },
  {
    name: "Hong Kong",
    country: "China",
    latitude: 22.3193,
    longitude: 114.1694,
  },
  { name: "Seville", country: "Spain", latitude: 37.3891, longitude: -5.9845 },
  { name: "Florence", country: "Italy", latitude: 43.7696, longitude: 11.2558 },
  { name: "Venice", country: "Italy", latitude: 45.4408, longitude: 12.3155 },
  { name: "Milan", country: "Italy", latitude: 45.4642, longitude: 9.19 },
];
