import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";
import NotFound from "./pages/NotFound";
import Recommendations from "./pages/Recommendations";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/category/:categoryId"
                            element={<MovieList />}
                        />
                        <Route
                            path="/movie/:movieId"
                            element={<MovieDetail />}
                        />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route
                            path="/recommended"
                            element={<Recommendations />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
