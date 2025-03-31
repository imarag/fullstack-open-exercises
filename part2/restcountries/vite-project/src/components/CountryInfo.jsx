import { useEffect, useState } from "react";
import axios from "axios";

export default function CountryInfo({ country, weather_api_key }) {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const countryLat = country.latlng[0];
  const countryLon = country.latlng[1];

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${countryLat}&lon=${countryLon}&units=metric&exclude=hourly,daily,minutely&appid=${weather_api_key}`
      )
      .then((response) => {
        const weatherData = response.data;
        setWeatherInfo(weatherData);
      })
      .catch((error) => {
        setWeatherInfo(null);
      });
  }, [countryLat, countryLon]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <p className="flag">{country.flag}</p>
      <h2>Weather in {country.name.common}</h2>
      {weatherInfo ? (
        <>
          <p>Temperature {weatherInfo?.current?.temp} Celsius</p>
          <img
            alt="weather icon"
            src={`https://openweathermap.org/img/wn/${weatherInfo?.current?.weather[0]?.icon}@2x.png`}
          />
          <p>Wind {weatherInfo?.current?.wind_speed} m/s</p>
        </>
      ) : (
        <p>There is no available weather data for {country.name.common}</p>
      )}
    </div>
  );
}
