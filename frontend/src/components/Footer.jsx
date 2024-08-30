import React, { useState, useEffect } from 'react';
import { Container, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import './css/Footer.css';

const Footer = () => {
    const [dica, setDica] = useState('');
    const [receitasAleatorias, setReceitasAleatorias] = useState([]);

    useEffect(() => {
        const fetchDica = async () => {
        try {
            const response = await axios.get('/api/dicas/aleatoria');
            setDica(response.data.texto);
        } catch (erro) {
            console.error('Erro ao buscar dica:', erro);
        }
        };

        const fetchReceitasAleatorias = async () => {
        try {
            const response = await axios.get('/api/receitas/aleatorias');
            setReceitasAleatorias(response.data);
        } catch (erro) {
            console.error('Erro ao buscar receitas aleatórias:', erro);
        }
        };

        fetchDica();
        fetchReceitasAleatorias();
    }, []);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Nuno, Igor e Vitória
        </Tooltip>
    );

    return (
        <footer className="footer">
            <Container fluid="xl" className="footer-container px-4">
                <Row>
                    <Col md={4} className="dica-container">
                        <img src="/assets/Dicas.png" alt="PapaEats Dicas" className='dicas-logo'/>
                        <h3 className="texto-extra-bold-italic">Dicas</h3>
                        <p className="dicas texto-normal">{dica}</p>
                    </Col>
                    <Col md={8} className="receitas-container">
                        <div className="receitas-grid d-none d-md-grid">
                            {receitasAleatorias.map((receita) => (
                                <Link key={receita.id} to={`/receita/${receita.id}`} className="receita-link">
                                    <div className="thumbnail-container">
                                        <img src={receita.thumbnailUrl} alt={receita.titulo} className="thumbnail" />
                                        <div className="receita-overlay">
                                            <p className="receita-titulo texto-bold-italic">{receita.titulo}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="made-with-love texto-light-italic">
                            made with <FaHeart className="heart-icon" /> by{' '}
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip}
                            >
                                <span className="us-highlight">US</span>
                            </OverlayTrigger>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;