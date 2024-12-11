# AirQuality

## Overview

The AirQuality project provides tools and frameworks for monitoring, analyzing, and visualizing air quality data. With this repository, you can:

- Access real-time air quality data using APIs
- Perform historical data analysis
- Visualize air quality trends and metrics
- Integrate data into custom applications or dashboards

This project is built with Python and incorporates several libraries and APIs to streamline air quality analysis.

---

## Features

- **API Integration**: Fetch data from multiple air quality APIs like OpenWeatherMap Air Pollution API, Weatherbit API, and WeatherAPI.
- **Data Visualization**: Create graphs and dashboards for air quality metrics using Chart.js and Plotly.
- **Historical Analysis**: Analyze trends over time using stored datasets.
- **City Search Functionality**: Intelligently search for cities with autocomplete and case-insensitivity.
- **Customizable**: Easily extend functionality to include additional APIs or custom visualizations.
- **AI Integration**: CO2 forecasting using TensorFlow models, including LSTM, GRU, Bidirectional LSTM, CNN with LSTM, and Deep LSTM.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Python 3.8 or later
- Pip (Python package manager)
- An active API key for one or more of the supported air quality APIs

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/niklasrosseck/AirQuality.git
   cd AirQuality
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up your API keys:
   - Create a `.env` file in the project root directory.
   - Add your API keys in the following format:
     ```env
     OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
     ```

---

## Usage

### Running the Application

1. Start the Flask server:

   ```bash
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Features

- **Search for a City**: Enter a city name in the search bar to fetch air quality data.
- **Real-Time Data**: View the latest air quality metrics, including AQI, pollutants, temperature, and humidity.
- **Historical Analysis**: Visualize trends for specific locations.

---

## Project Structure

```
AirQuality/
├── app.py               # Main application entry point
├── templates/           # HTML templates for Flask
├── static/              # Static files (CSS, JS, images, data)
├── services/            # Python scripts for accessing the APIs and for predicting the CO2
├── models/              # The models used for forecasting CO2
├── routes.py            # All routes for the Flask app
├── ai_data_fetch.py     # Fetches data periodically from the API every 10 minutes
├── .env                 # Environment variables (not included in repo)
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

---

## Supported APIs

### OpenWeatherMap Air Pollution API

- Offers air quality data and historical weather data.
- [Documentation](https://openweathermap.org/api/air-pollution)

### Weatherbit API

- Provides comprehensive air quality data.
- [Documentation](https://www.weatherbit.io/api/air-quality)

### WeatherAPI

- Allows integration of weather and air quality data.
- [Documentation](https://www.weatherapi.com/docs/)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - Web framework used for the backend.
- [Chart.js](https://www.chartjs.org/) - For creating interactive charts.
- [Plotly](https://plotly.com/) - For advanced data visualization.
- [OpenWeatherMap](https://openweathermap.org/) - For weather and pollution data.
- [Weatherbit](https://www.weatherbit.io/) - For air quality and weather metrics.
- [WeatherAPI](https://www.weatherapi.com/) - For air quality and weather forecasting.
