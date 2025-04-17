import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="logo">
                <Link to="/">
                    <span className="logo-text">PREPARE.SH THEATER</span>
                </Link>
            </div>

            <div
                className="mobile-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span>☰</span>
            </div>

            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                <Link
                    to="/category/trending"
                    onClick={() => setMenuOpen(false)}
                >
                    Trending
                </Link>
                <Link to="/category/movies" onClick={() => setMenuOpen(false)}>
                    Movies
                </Link>
                <Link to="/category/tvshows" onClick={() => setMenuOpen(false)}>
                    TV Shows
                </Link>
                <Link to="/category/new" onClick={() => setMenuOpen(false)}>
                    New Releases
                </Link>
                <Link to="/category/mylist" onClick={() => setMenuOpen(false)}>
                    My List
                </Link>
                <Link
                    to="/recommended"
                    onClick={() => setMenuOpen(false)}
                >
                    Recommendations
                </Link>
            </div>

            <div className="user-menu">
                <Link to="/watchlist">
                    <span className="material-icons">account_circle</span>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
