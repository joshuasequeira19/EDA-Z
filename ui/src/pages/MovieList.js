import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function MovieList() {
  const { categoryId } = useParams();
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`/api/categories/${categoryId}`)
      .then(res => res.json())
      .then(data => setCategory(data));
    
    fetch(`/api/categories/${categoryId}/movies`)
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return <div className="loading">Loading content</div>;
  }

  return (
    <div className="movie-list">
      <div className="category-header">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>
      
      {movies.length === 0 ? (
        <p className="no-movies">No content found in this category.</p>
      ) : (
        <div className="movies-grid">
          {movies.map(movie => (
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
      )}
    </div>
  );
}

export default MovieList;