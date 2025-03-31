export default function CountryItem({ country, setSelectedCountry }) {
  return (
    <li key={country.name.common}>
      <span>{country.name.official}</span>
      <span> </span>
      <button onClick={() => setSelectedCountry(country)}>Show</button>
    </li>
  );
}
