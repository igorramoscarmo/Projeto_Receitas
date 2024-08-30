import React, { useState, useEffect } from 'react';
import { Row, Col, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShare, FaComment, FaStar, FaStarHalfAlt, FaRegStar, FaCheck, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import './css/ReceitaCard.css';

const ReceitaCard = ({ receita, onFavoriteToggle }) => {
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const [restaurantesSugeridos, setRestaurantesSugeridos] = useState([]);
    const [isFavorite, setIsFavorite] = useState(receita.isFavorite);

    useEffect(() => {
        const fetchRestaurantes = async () => {
            try {
                const response = await axios.get(`/api/receitas/${receita.id}/restaurantes`);
                setRestaurantesSugeridos(response.data.slice(0, 3));
            } catch (erro) {
                console.error('Erro ao buscar restaurantes sugeridos:', erro);
            }
        };

        fetchRestaurantes();
    }, [receita.id]);


    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/receita/${receita.id}`);
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 3000);
    };

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
                stars.push(<FaRegStar key={i} className="star-empty" />);
            }
        }
        return stars;
    };

    const renderRestaurantes = () => {
        if (restaurantesSugeridos.length === 0) return null;

        return (
            <div className="restaurantes-sugeridos">
                <span className="texto-bold">Experimente em: </span>
                {restaurantesSugeridos.map((rest, index) => (
                    <span key={rest.idRestaurante}>
                        <Link to={`http://www.${rest.website}`}>
                            {rest.nome}
                            {rest.assinaturaAtiva && (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-${rest.idRestaurante}`}>Parceiro</Tooltip>}
                                >
                                    <span><FaCheck className="parceiro-icon" /></span>
                                </OverlayTrigger>
                            )}
                        </Link>
                        {index < restaurantesSugeridos.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>
        );
    };

    const handleFavoriteToggle = async () => {
        try {
            const response = await axios.post(`/api/receitas/${receita.id}/favorito`, {}, { withCredentials: true });
            setIsFavorite(response.data.favorito);
            if (onFavoriteToggle) onFavoriteToggle(receita.id, response.data.favorito);
        } catch (error) {
            console.error('Erro ao alternar favorito:', error);
        }
    };


    return (
        <div className="receita-card">
            <Row>
                <Col xs={11} sm={4} md={4} lg={4} className="mb-3 mb-sm-0">
                    <div className="thumbnail-container">
                        <img src={receita.imagemUrl} alt={receita.titulo} className="thumbnail" />
                        <div className="receita-overlay">
                            <button onClick={handleShare} className="share-button texto-bold-italic">
                                <FaShare /> Partilhar
                            </button>
                            {showCopyMessage && <div className="copy-message">Link copiado!</div>}
                        </div>
                    </div>
                </Col>
                <Col xs={11} sm={7} md={7} lg={7}>
                    <div className="card-body">
                        <h3 className="card-title texto-bold">
                            <Link to={`/receita/${receita.id}`}>{receita.titulo}</Link>
                        </h3>
                        <div className="categorias texto-light-italic">
                            {receita.categorias.map((categoria, index) => (
                                <Link key={index} to={`/pesquisa?termo=${categoria}`} className="categoria-link">
                                    {categoria}
                                </Link>
                            ))}
                        </div>
                        <p className="card-text texto-normal">{receita.descricao}</p>
                        {renderRestaurantes()}
                        <div className="receita-info texto-normal">
                            <span className="recipe-rating">
                                {renderStars(Number(receita.avaliacaoMedia))}
                            </span>
                            <span className="recipe-comments">
                                <FaComment /> {receita.numeroComentarios}
                            </span>
                            <span>publicado a {new Date(receita.dataPublicacao).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Col>
                <Col xs={1} sm={1} md={1} lg={1} className="mb-3 mb-sm-0">
                    <div className="receita-badges">
                        <Badge bg="info">{receita.dificuldade}</Badge>
                        <FaHeart
                            className="favorite-icon"
                            onClick={handleFavoriteToggle}
                            color={isFavorite ? "#98a66c" : "#534c42"}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ReceitaCard;