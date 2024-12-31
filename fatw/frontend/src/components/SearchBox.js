import React from "react";
import styles from "./SearchBox.module.css";

const SearchBox = ({ query, setQuery, searchFestivalName }) => {
    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search for a festival..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    searchFestivalName(e.target.value); // Trigger dynamic search
                }}
                className={styles.searchInput}
            />
        </div>
    );
};

export default SearchBox;

