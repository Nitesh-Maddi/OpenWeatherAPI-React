import React, { useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./App.css";

function WeatherCard({ cityData, onRemove }) {
  return (
    <Col md={2}>
      <Card className="weather-card">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Card.Title>{cityData.name}</Card.Title>
            <button className="btn btn-danger" onClick={() => onRemove(cityData.name)}>
              X
            </button>
          </div>
          <Card.Subtitle className="mb-2 text-muted">
            {cityData.weather[0].description}
          </Card.Subtitle>
          <div className="d-flex align-items-center">
            <div className="temperature">
              <h1>{Math.round(cityData.main.temp)}°F</h1>
              <p>
                Feels like {Math.round(cityData.main.feels_like)}°F
              </p>
            </div>
            <div className="icon">
              <img
                src={`http://openweathermap.org/img/w/${cityData.weather[0].icon}.png`}
                alt={cityData.weather[0].description}
              />
            </div>
          </div>
          <div className="details mt-3">
            <p>Humidity: {cityData.main.humidity}%</p>
            <p>Pressure: {cityData.main.pressure} hPa</p>
            <p>Wind Speed: {cityData.wind.speed} mph</p>
            <p>
              Wind Direction:{" "}
              {cityData.wind.deg ? cityData.wind.deg + "°" : "-"}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

function App() {
  const API_KEY = "59560573a27b13eb4165d1820f992467";

  const [city, setCity] = useState("");
  const [weatherCards, setWeatherCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleCityChange(event) {
    setCity(event.target.value);
  }

  function handleCitySearch() {
    setLoading(true);
    setError(false);

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      )
      .then((response) => {
        const existingCityIndex = weatherCards.findIndex(
          (weather) => weather.name === response.data.name
        );
        if (existingCityIndex !== -1) {
          const updatedWeatherCards = [...weatherCards];
          updatedWeatherCards[existingCityIndex] = response.data;
          setWeatherCards(updatedWeatherCards);
       
        } else {
          setWeatherCards((prevWeatherCards) => [...prevWeatherCards,response.data]);
        }
        setLoading(false);
        setCity("");
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
    }

    function handleRemoveCity(cityName) {
    setWeatherCards(
    weatherCards.filter((city) => city.name !== cityName)
    );
    }

  return (
    <div className="main-container">
      <div className="search-container">
        <div className="card-container">
          <div className="card">
            <div className="card-header">
              <h1>Weather App</h1>
            </div>
            <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="city">Enter City Name</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    placeholder="e.g. New York"
                    value={city}
                    onChange={handleCityChange}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleCitySearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              {loading && (
                <div className="text-center">
                  <p>Loading...</p>
                </div>
              )}
              {error && (
                <div className="text-center">
                  <p>Error fetching weather data</p>
                </div>
              )}
            </div>
            <div className="card-footer">
              <p>
                Powered by{" "}
                <a
                  href="https://openweathermap.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenWeatherMap
                </a>
              </p>
            </div>
          </div>
        </div>
        </div>
        <Container className="weather-cards-container">
          <Row>
            {weatherCards.map((cityData) => (
              <WeatherCard
                key={cityData.id}
                cityData={cityData}
                onRemove={handleRemoveCity}
              />
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;

