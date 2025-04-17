import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    fetch(`/api/watchlist`)
      .then(res => res.json())
      .then(data => {
        setWatchlistItems(data);
        setLoading(false);
      });
  }, []);

  const removeItem = (itemId) => {
    fetch(`/api/watchlist/remove/${itemId}`, { method: 'DELETE' })
      .then(() => {
        setWatchlistItems(watchlistItems.filter(item => item.id !== itemId));
      });
  };

  if (loading) {
    return <div className="loading">Loading your watchlist</div>;
  }

  return (
    <div className="watchlist">
      <h1>My List</h1>
      
      {watchlistItems.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your list is empty</p>
          <Link to="/" className="browse-movies">Browse Movies & Shows</Link>
        </div>
      ) : (
        <div className="watchlist-items">
          {watchlistItems.map(item => (
            <div key={item.id} className="watchlist-item">
              <div className="item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="director">{item.director}</p>
                <p className="duration">{item.duration} min</p>
              </div>
              <div className="item-rating">
                <span className="material-icons">star</span>
                <span>{item.rating}/10</span>
              </div>
              <button className="remove-item" onClick={() => removeItem(item.id)}>
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;