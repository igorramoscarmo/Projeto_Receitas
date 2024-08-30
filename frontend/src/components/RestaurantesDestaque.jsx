import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import './css/RestaurantesDestaque.css';

const RestaurantesDestaque = () => {
    const [restaurantesDestaque, setRestaurantesDestaque] = useState([]);

    useEffect(() => {
        const fetchRestaurantesDestaque = async () => {
            try {
                const response = await axios.get('/api/restaurantes/destaque');
                setRestaurantesDestaque(response.data);
            } catch (erro) {
                console.error('Erro ao buscar restaurantes em destaque:', erro);
            }
        };

        fetchRestaurantesDestaque();
    }, []);

    return (
        <Container fluid="xl" className="restaurantes-destaque-wrapper ">
            <h2 className="text-center mb-4 texto-extra-bold-italic">Alguns dos nossos parceiros...</h2>
            <Row className="justify-content-center">
                {restaurantesDestaque.map((restaurante) => (
                    <Col key={restaurante.idRestaurante} xs={6} sm={3} className="mb-4 text-center">
                        <a href={`http://www.${restaurante.website}`} target="_blank" rel="noopener noreferrer">
                            <img 
                                src={`/images/restaurantes/${restaurante.folder}/logotipo.png`}
                                alt={`Logotipo ${restaurante.nome}`}
                                className="restaurante-logo"
                            />
                        </a>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default RestaurantesDestaque;