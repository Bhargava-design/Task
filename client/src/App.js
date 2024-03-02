import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {console.log("Data from PostgreSQL:", data); // Log data in console
      setData(data);})
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = () => {
        // Fetch data based on search query
    fetch(`/api/data?search=${searchQuery}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSort = criteria => {
      //set sorting criteria
    setSortCriteria(criteria);
  };

  const filteredData = data.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData];
  if (sortCriteria === 'date') {
    sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortCriteria === 'time') {
    sortedData.sort((a, b) => new Date('1970-01-01 ' + a.created_at) - new Date('1970-01-01 ' + b.created_at));
  }

  return (
    <div className="container">
      <h1>Build a REACT and NODE JS application with PostgreSQL database</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search by name or location" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="sort-buttons">
        <button onClick={() => handleSort('date')}>Sort by Date</button>
        <button onClick={() => handleSort('time')}>Sort by Time</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>sno</th>
            <th>name</th>
            <th>mobile</th>
            <th>location</th>
            <th>time</th>
            <th>date</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(row => (
            <tr key={row.sno}>
              <td>{row.sno}</td>
              <td>{row.name}</td>
              <td>{row.mobile}</td>
              <td>{row.location}</td>
              <td>{row.time}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
