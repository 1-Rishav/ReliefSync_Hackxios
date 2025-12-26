// SearchBar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {motion} from 'motion/react'

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY; // Recommended: use env file

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (!query) return setSuggestions([]);

    // Debounced API call
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // Wait 300ms after user stops typing
    setDebounceTimeout(timeout);
  }, [query]);

  const fetchSuggestions = async (text) => {
    try {
      const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
        params: {
          text,
          limit: 5,
          apiKey: GEOAPIFY_KEY,
        },
      });
      const results = response.data.features.map(f => ({
        name: f.properties.formatted,
        lat: f.properties.lat,
        lng: f.properties.lon,
      }));
      setSuggestions(results);
    } catch (error) {
      console.error('Geoapify error:', error);
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.name);
    setSuggestions([]);
    onSelect(place); // Pass to parent map
    setQuery('')
  };

  return (
    <motion.div
    initial={{
            boxShadow: "0px 0px 10px 2px rgba(8,112,184,0.5)",
            
          }}
          whileTap={{
            y:0
        }}
            whileHover={{
              boxShadow: "0px 10px 40px rgba(8,112,184,0.7)",
              y: -5
            }}
            transition={{
            duration:0.3,
            ease:"easeInOut"
        }}
    className="relative z-10 rounded-lg w-full max-w-lg ">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search country, state, or city"
        className="w-full p-3 border rounded-md shadow"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white z-100000 w-full border mt-1 rounded shadow">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s) }
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default SearchBar;
