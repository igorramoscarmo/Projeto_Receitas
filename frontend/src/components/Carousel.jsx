import React, { useState, useEffect } from 'react';
import { Carousel, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaComment, FaStarHalfAlt } from 'react-icons/fa';
import axios from 'axios';
import './css/Carousel.css';

const ReceitasCarousel = () => {
    const [receitas, setReceitas] = useState([]);

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await axios.get('/api/receitas/carousel');
                setReceitas(response.data);
            } catch (erro) {
                console.error('Erro ao buscar receitas para o carrossel:', erro);
            }
        };

        fetchReceitas();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2;
        const fullStars = Math.floor(roundedRating);
        const hasHalfStar = roundedRating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="star-filled" />);
            }
            else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="star-half" />);
            } 
            
            else {
                stars.push(<FaRegStar  key={i} className="star-empty" />);
            }
        }
        return stars;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    };
    console.log(receitas);
    return (
        <Container fluid="xl" className="carousel-container px-4 d-none d-md-block">
            <Carousel>
                {receitas.map((receita) => (
                    
                    <Carousel.Item key={receita.id}>
                        <img
                            className="d-block w-100"
                            src={receita.imagemUrl}
                            alt={receita.titulo}
                        />
                        <Carousel.Caption>
                            <Link to={`/receita/${receita.id}`}>
                                <h2 className="texto-bold">{receita.titulo}</h2>
                            </Link>
                            <div className="recipe-info">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-comentarios-${receita.id}`}>
                                            {receita.ultimoComentario 
                                                ? `Último comentário: ${formatDate(receita.ultimoComentario)}`
                                                : "Ainda não há comentários"}
                                        </Tooltip>
                                    }
                                >
                                    <span className="comments">
                                        <FaComment /> {receita.numeroComentarios}
                                    </span>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-avaliacao-${receita.id}`}>
                                            Média: {receita.avaliacaoMedia.toFixed(1)}/5.0
                                            <br />
                                            Total de avaliações: {receita.totalAvaliacoes}
                                        </Tooltip>
                                    }
                                >
                                    <span className="rating">
                                    {renderStars(Number(receita.avaliacaoMedia))}
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};

export default ReceitasCarousel;