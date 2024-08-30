// src/views/HomePage.jsx

import React from 'react';
import NavBar from '../components/NavBar';
import ReceitasCarousel from '../components/Carousel';
import SearchBar from '../components/SearchBar';
import ReceitasRecentes from '../components/ReceitasRecentes';
import RestaurantesDestaque from '../components/RestaurantesDestaque';
import Footer from '../components/Footer';
import '../App.css';

function HomePage({ currentUser, setCurrentUser }) {
    return (
        <>
        <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="main-content">
            <ReceitasCarousel />
            <SearchBar />
            <ReceitasRecentes />
            <RestaurantesDestaque />
            <Footer />
        </div>
        </>
    );
}

export default HomePage;