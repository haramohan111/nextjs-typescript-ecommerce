import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchSearchResults,
  setQuery,
  clearSearch,
} from "@/redux/slices/searchSlice";
import Image from "next/image";

const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { query, results, loading, error } = useSelector(
    (state: RootState) => state.search
  );

  const [localQuery, setLocalQuery] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (localQuery.trim() !== "") {
        dispatch(setQuery(localQuery));
        dispatch(fetchSearchResults(localQuery));
        setShowSuggestions(true);
      } else {
        dispatch(clearSearch());
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [localQuery, dispatch]);

  const handleSuggestionClick = (product: { name: string }) => {
    setLocalQuery(product.name);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <form action="#" className="search">
        <div className="input-group">
          <input
            id="search"
            name="search"
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
          <button className="btn btn-primary text-white" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>

      {showSuggestions && results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 1000,
            listStyle: "none",
            padding: "10px",
            margin: 0,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {results.map((product) => (
            <li
              key={product.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => handleSuggestionClick(product)}
            >
              <Image
                 src={require(`../../../backend/uploads/${product.image}`)}
                alt={product.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  marginRight: "10px",
                  objectFit: "cover",
                }}
              />
              <span>{product.name}</span>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && loading && <p>Loading...</p>}
      {showSuggestions && error && <p>Error: {error}</p>}
    </div>
  );
};

export default Search;
