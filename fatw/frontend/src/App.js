import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FestivalList from "./components/FestivalList";
import SearchBox from "./components/SearchBox";
import Header from "./components/Header";

const App = () => {
    const [festivals, setFestivals] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                const response = await axios.get("http://localhost:5001/festivals");
                setFestivals(response.data);
            } catch (error) {
                console.error("Error fetching festivals:", error);
            }
        };

        fetchFestivals();
    }, []);

    let debounceTimer;
    const debounce = (func, delay) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    };


    const searchFestivalName = async () => {
        debounce(async () => {
            if (!query.trim()) {
                setFestivals([]); // Clear results if the input is empty
                return;
            }
        try {
                const response = await axios.get(`http://localhost:5001/search?query=${query}`);
                setFestivals(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setFestivals([]); // No results found
                } else {
                    console.error("Error searching festivals:", error);
                }
            }
        }, 300);
    };


    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <h1>Festival Explorer</h1>
                                <SearchBox query={query} setQuery={setQuery} searchFestivalName={searchFestivalName} />
                                <FestivalList festivals={festivals} />
                            </>
                        }
                    />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
