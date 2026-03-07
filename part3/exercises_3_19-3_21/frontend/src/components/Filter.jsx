export default function Filter({ searchParam, setSearchParam }) {
  return (
    <div>
      <label htmlFor="search">filter shown with</label>
      <input
        id="search"
        type="search"
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
      />
    </div>
  );
}
