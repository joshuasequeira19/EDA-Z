import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Recommendations() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Add state to hold potential error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error on new fetch attempt
    setMovies([]); // Clear previous movies

    fetch(`/api/movies/recommended`)
      .then(async (response) => {
        // Use async to await json parsing
        // Check if the response status is not OK (e.g., 4xx, 5xx)
        if (!response.ok) {
          let errorData = null;
          let errorMessage = `Failed to load recommendations: Status ${response.status}`;
          try {
            // Try to parse error details from the backend JSON response
            errorData = await response.json();
            // Use the specific error code if available
            errorMessage = errorData?.error || errorMessage; // Prefer the specific code
          } catch (jsonError) {
            // If parsing fails, use the status text
            errorMessage = `${errorMessage} - ${response.statusText}`;
            console.warn("Could not parse JSON error response:", jsonError);
          }
          // Throw an error object containing the specific code or status text
          const error = new Error(errorMessage);
          error.code = errorData?.error; // Attach the specific code
          error.userMessage = errorData?.message; // Attach the user-friendly message from backend
          throw error;
        }
        // If response is OK, parse the actual movie data
        const data = await response.json();
        // Basic validation that we received an array
        if (!Array.isArray(data)) {
          console.error(
            "API response for recommendations was not an array:",
            data
          );
          throw new Error("Received invalid data format for recommendations.");
        }
        return data; // Return the movie array
      })
      .then((data) => {
        // This runs only if the fetch was successful and data is valid
        setMovies(data);
      })
      .catch((err) => {
        // Catch errors from fetch or thrown above
        console.error("Error fetching recommendations:", err);
        // Check for our specific error codes
        if (
          err.code === "ERR_RECOMMEND_ENDPOINT_CONFIG" ||
          err.code === "ERR_RECOMMEND_ENDPOINT_CONNECTION"
        ) {
          // Set a user-friendly error message for specific backend issues
          setError(
            err.userMessage ||
              "Recommendations are currently unavailable. Please try again later."
          );
        } else {
          // Set a generic error message for other errors
          setError("Could not load recommendations at this time.");
        }
        setMovies([]); // Ensure movies array is empty on error
      })
      .finally(() => {
        // Always set loading to false after fetch completes (success or error)
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // 1. Handle Loading State
  if (isLoading) {
    return <div className="loading">Loading Recommendations...</div>; // Improved loading text
  }

  // 2. Handle Error State
  if (error) {
    // Display the error message within the page structure
    return (
      <div className="recommendations-page">
        {" "}
        {/* Optional wrapper class */}
        <div className="category-header">
          <h1>Recommended Movies</h1>
        </div>
        <div
          className="error-message"
          style={{ padding: "20px", textAlign: "center" }}
        >
          {error}
        </div>
      </div>
    );
  }

  // 3. Handle No Movies Found (after successful fetch)
  if (movies.length === 0) {
    return (
      <div className="recommendations-page">
        {" "}
        {/* Optional wrapper class */}
        <div className="category-header">
          <h1>Recommended Movies</h1>
        </div>
        <p
          className="no-movies"
          style={{ padding: "20px", textAlign: "center" }}
        >
          No recommendations found for you right now. Try liking some movies to
          get started !
        </p>
      </div>
    );
  }

  // 4. Display Movies (Success case)
  return (
    <div className="recommendations-page movie-list">
      {" "}
      {/* Added wrapper class */}
      <div className="category-header">
        <h1>Recommended Movies</h1>
        <p>
          Curated for you, Your next favorite movies and TV shows starts here !
        </p>
      </div>
      {/* movies.map logic remains the same */}
      <div className="movies-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
            <div className="movie-poster">
              <img src={movie.imageUrl} alt={movie.name} />
              <div className="play-button">
                <span className="material-icons">play_arrow</span>
              </div>
            </div>
            <div className="movie-info">
              <h3>{movie.name}</h3>
              <p className="director">{movie.director}</p>
              <div className="rating">
                <span className="material-icons">star</span>
                <span>{movie.rating}/10</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
