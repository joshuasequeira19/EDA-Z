import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Fetch categories - using the correct endpoint
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
    
    // Fetch featured movies - using the correct endpoint
    fetch('/api/movies/featured')
      .then(res => res.json())
      .then(data => {
        setFeaturedMovies(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching featured movies:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Unlimited movies, TV shows, and more</h1>
          <p>Watch anywhere. Cancel anytime.</p>
          <Link to="/category/trending" className="cta-button">
            <span className="material-icons">play_arrow</span> Watch Now
          </Link>
        </div>
      </div>
      
      <section className="categories-section">
        <h2>Popular Categories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link to={`/category/${category.id}`} key={category.id} className="category-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${category.imageUrl || '/images/categories/default.jpg'})`
            }}>
              <div className="category-content">
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="featured-section">
        <h2>Trending Now</h2>
        <div className="featured-movies">
          {featuredMovies.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
              <div className="movie-poster">
                <img src={movie.imageUrl || '/images/movies/default.jpg'} alt={movie.name} />
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
      </section>
      
      <section className="quote-section">
        <blockquote>
          "Movies can and do have tremendous influence in shaping young lives in the realm of entertainment towards the ideals and objectives of normal adulthood."
          <cite>— Walt Disney</cite>
        </blockquote>
      </section>
    </div>
  );
}

export default Home;