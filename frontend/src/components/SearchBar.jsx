import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';

const SearchBar = ({ initialTerm }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (initialTerm) {
            setSearchTerm(initialTerm);
        }
    }, [initialTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/pesquisa?termo=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <Container fluid="xl" className="search-container px-4">
            <div className="search-section">
                <Form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="vamos cozinhar alguma coisa?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input texto-normal-italic"
                        />
                        <button type="submit" className="search-button">
                            <BsSearch />
                        </button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default SearchBar;
