import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsLiking(false);
    setLikeError(null);
    setLiked(false);

    fetch(`/api/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(
              `Failed to fetch movie details: Status ${res.status} - ${
                text || res.statusText
              }`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setLikeError(`Failed to load movie details: ${error.message}`);
        setMovie(null);
        setLoading(false);
      });
  }, [movieId]);

  const addToWatchlist = () => {
    if (!movie || !movie.id) return;
    fetch("/api/watchlist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId: movie.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Added to your watchlist!");
        } else {
          alert(
            "Error adding to watchlist: " + (data.error || "Unknown error")
          );
        }
      })
      .catch((error) => {
        alert("Error adding to watchlist: " + error.message);
      });
  };

  const startStreaming = () => {
    if (movie && movie.name) {
      alert(`Now streaming: ${movie.name}`);
    }
  };

  // Handler function for the Like button
  const handleLike = () => {
    if (!movie || !movie.id) {
      alert("Movie data is not available to get ID for liking.");
      return;
    }

    setIsLiking(true); // Set loading state
    setLikeError(null); // Clear previous errors
    setLiked(false); // Reset liked status for new attempt

    // POST request TO THE FLASK BACKEND endpoint
    fetch("/api/movies/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: movie.id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          let errorData = null;
          let errorMessage = `Like request failed: Status ${response.status} - ${response.statusText}`;
          try {
            // Try to parse the error response body from Flask
            errorData = await response.json();
            // Use the specific error code if available
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (jsonError) {
            console.warn("Could not parse JSON error response:", jsonError);
          }

          const error = new Error(errorMessage);
          error.code = errorData?.error;
          throw error;
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log(
            "Like registered successfully via backend:",
            data.message || "Success"
          );
          setLiked(true);
          if (movie && movie.name) {
            alert(`${movie.name} liked!`);
          } else {
            alert("Like registered!");
          }
        } else {
          const error = new Error(
            data.error || "Backend reported failure in liking the movie."
          );
          error.code = data.error;
          throw error;
        }
      })
      .catch((error) => {
        console.error("Error during like process:", error);

        if (
          error.code === "ERR_LIKE_ENDPOINT_CONFIG" ||
          error.code === "ERR_LIKE_ENDPOINT_CONNECTION"
        ) {
          alert("Like endpoint not yet connected !");
          setLiked(false);
        } else {
          setLikeError(error.message || "Failed to register like.");
          setLiked(false);
        }
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  if (likeError && !movie) {
    return <div className="error-message">{likeError}</div>;
  }

  if (!movie) {
    return <div className="not-found">Movie not found or failed to load.</div>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-image">
        <img src={movie.imageUrl} alt={movie.name} />
      </div>
      <div className="movie-details">
        <h1>{movie.name}</h1>
        <h2>Directed by {movie.director}</h2>
        <div className="rating">
          <span className="material-icons">star</span>
          <span>{movie.rating}/10</span>
        </div>

        <div className="movie-description">
          <h3>Synopsis</h3>
          <p>{movie.description}</p>
        </div>

        <div className="movie-meta">
          <div className="meta-item">
            <span>Genre:</span>
            {movie.categoryId ? (
              <Link to={`/category/${movie.categoryId}`}>{movie.category}</Link>
            ) : (
              <span>{movie.category}</span>
            )}
          </div>
          <div className="meta-item">
            <span>Duration:</span> {movie.duration} min
          </div>
          <div className="meta-item">
            <span>Released:</span> {movie.released}
          </div>
          <div className="meta-item">
            <span>Cast:</span> {movie.cast}
          </div>
        </div>
        {likeError && (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            Error liking: {likeError}{" "}
          </div>
        )}

        <div className="watch-options">
          <button onClick={startStreaming} className="watch-now">
            <span className="material-icons">play_arrow</span> Watch Now
          </button>
          <button onClick={addToWatchlist} className="add-to-list">
            <span className="material-icons">playlist_add</span> Add to My List
          </button>
          <button
            onClick={handleLike}
            className={`watch-now ${liked ? "liked" : ""}`}
            disabled={isLiking || liked}
            style={{ marginLeft: "10px" }}
          >
            <span className="material-icons">thumb_up</span>
            {isLiking ? "Liking..." : liked ? "Liked!" : "Like"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
