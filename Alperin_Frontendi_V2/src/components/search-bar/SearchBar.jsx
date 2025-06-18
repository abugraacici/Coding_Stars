import './SearchBar.css';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';

import Filter from '../filter/Filter';

import {
    addSearchQuery,
    getSearchHistory,
    removeSearchQuery,
} from '../../services/searchServices';

export default function SearchBar({ onQueryChanged, onCategoryChanged }) {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        setIsFocused(true);
        onQueryChanged(value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && query.trim() !== '') {
            const trimmedQuery = query.trim();

            if (!token) return;

            setHistory((prev) => {
                const newHistory = prev.filter((item) => item !== trimmedQuery);
                newHistory.unshift(trimmedQuery);
                return newHistory.slice(0, 10);
            });

            addSearchQuery(trimmedQuery, token);
            setIsFocused(false);
        }
    };

    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (!token) return;
        getSearchHistory(token)
            .then((response) => {
                if (response.success) {
                    setHistory(response.data);
                }
            })
            .catch(() => {
                // err
            });
    }, [token]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isFocused]);

    const filteredHistory = history.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    const displayedHistory = query ? filteredHistory : history;

    const limitedHistory = displayedHistory.slice(0, 10);

    const handleClear = () => {
        setQuery('');
        setIsFocused(false);
        onQueryChanged('');
    };

    const handleHistoryItemClick = (item) => {
        setQuery(item);
        setIsFocused(false);
        onQueryChanged(item);
    };

    const onRemove = (item) => {
        const filteredHistory = history.filter(
            (historyItem) => historyItem !== item
        );
        setHistory(filteredHistory);
        removeSearchQuery(item, token);
    };

    return (
        <div className="search-bar-wrapper" ref={inputRef}>
            <Filter onCategoryChanged={onCategoryChanged} />

            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="Ürün ara..."
                    className="search-input"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    autoComplete="off"
                />
                {query && (
                    <MdClose
                        size={20}
                        className="search-clear-icon"
                        onClick={handleClear}
                    />
                )}

                {isFocused && limitedHistory.length > 0 && (
                    <ul className="search-history-dropdown">
                        {limitedHistory.map((item, index) => (
                            <li key={index} className="search-history-item">
                                <span
                                    className="search-history-text"
                                    onClick={() => handleHistoryItemClick(item)}
                                >
                                    {item}
                                </span>
                                <MdClose
                                    size={18}
                                    className="search-history-close"
                                    onClick={() => onRemove(item)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
