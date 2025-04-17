import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CineStream</h3>
          <p>The ultimate destination for movies and TV shows streaming.</p>

        </div>
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category/movies">Movies</Link></li>
            <li><Link to="/category/tvshows">TV Shows</Link></li>
            <li><Link to="/category/new">New Releases</Link></li>
            <li><Link to="/category/mylist">My List</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@cinestream.com</p>
          <p>Phone: +1 123-456-7890</p>
          <p>Hours: 24/7 Customer Support</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PREPARE.SH THEATER. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;