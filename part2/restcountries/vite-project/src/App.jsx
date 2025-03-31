import { useEffect, useState } from "react";
import axios from "axios";
import CountryInfo from "./components/CountryInfo";
import CountryItem from "./components/CountryItem";
import "./index.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const weather_api_key = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (searchText) {
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then((response) => {
          const allCountries = response.data;
          const searchParamLower = searchText.toLowerCase();
          const filteredCountries = allCountries.filter((country) => {
            const countryNameOfficial = country.name.official.toLowerCase();
            const countryNameCommon = country.name.common.toLowerCase();
            return (
              countryNameOfficial.includes(searchParamLower) ||
              countryNameCommon.includes(searchParamLower)
            );
          });

          if (filteredCountries.length <= 1) {
            setSelectedCountry(null);
          }
          setCountries(filteredCountries);
        })
        .catch((error) => {
          setSelectedCountry(null);
          setCountries([]);
        });
    }
  }, [searchText]);

  return (
    <>
      <header></header>
      <main>
        <div>
          <span>find countries</span>{" "}
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="search"
            id="search"
            name="search"
          />
        </div>
        {countries.length === 1 ? (
          <CountryInfo
            country={countries[0]}
            weather_api_key={weather_api_key}
          />
        ) : countries.length > 1 && countries.length <= 10 ? (
          <ul role="list">
            {countries.map((country) => (
              <CountryItem
                key={country.name.common}
                country={country}
                setSelectedCountry={setSelectedCountry}
              />
            ))}
          </ul>
        ) : countries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : (
          <p></p>
        )}
        {selectedCountry && (
          <CountryInfo
            country={selectedCountry}
            weather_api_key={weather_api_key}
          />
        )}
      </main>
      <footer></footer>
    </>
  );
}

export default App;
