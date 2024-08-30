// src/components/RestauranteCard.jsx

import React from 'react';
import { Col } from 'react-bootstrap';
import './css/RestauranteCard.css';

const RestauranteCard = ({ restaurante }) => {
    return (
        <Col xs={6} sm={3} className="mb-4 text-center restaurante-card">
            <a href={`http://www.${restaurante.website}`} target="_blank" rel="noopener noreferrer">
                <img 
                    src={`/images/restaurantes/${restaurante.folder}/logotipo.png`}
                    alt={`Logotipo ${restaurante.nome}`}
                    className="restaurante-logo"
                />
            </a>
        </Col>
    );
};

export default RestauranteCard;