import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Badge, ListGroup, Form, Button, Modal } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import './css/ReceitaDetalhesPage.css';

const ReceitaDetalhesPage = ({ currentUser, setCurrentUser }) => {
    const { id } = useParams();
    const [receita, setReceita] = useState(null);
    const [passosConcluidos, setPassosConcluidos] = useState({});
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
    const [avaliacao, setAvaliacao] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceita = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/receitas/${id}`);
                setReceita(response.data);
                setPassosConcluidos(Object.fromEntries(response.data.passos.map(p => [p.passo, false])));
            } catch (erro) {
                console.error('Erro ao buscar detalhes da receita:', erro);
                setError('Não foi possível carregar a receita. Por favor, tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchReceita();
    }, [id]);

    const handlePassoConcluido = (passo) => {
        const novoPassosConcluidos = { ...passosConcluidos, [passo]: !passosConcluidos[passo] };
        setPassosConcluidos(novoPassosConcluidos);

        if (Object.values(novoPassosConcluidos).every(Boolean)) {
            setShowAvaliacaoModal(true);
        }
    };

    useEffect(() => {
        if (receita) {
            setPassosConcluidos(
                Object.fromEntries(receita.passos.map(p => [p.passo, false]))
            );
        }
    }, [receita]);

    const handleSubmitAvaliacao = async () => {
        try {
            const response = await axios.post(`/api/receitas/${id}/avaliar`, { avaliacao }, { withCredentials: true });
            setShowAvaliacaoModal(false);
            setReceita(prevReceita => ({
                ...prevReceita,
                avaliacaoMedia: response.data.mediaAvaliacao
            }));
        } catch (erro) {
            console.error('Erro ao submeter avaliação:', erro);
            // Mostrar mensagem de erro ao utilizador
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!receita) return <div>Receita não encontrada</div>;

    return (
        <>
            <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <Container className="receita-detalhes-container">

                <Row>
                    <Col xs={12}>
                        <SearchBar />
                    </Col>
                </Row>
                <h2 className="texto-extra-bold-italic mb-4 text-center receita-titulo">{receita.titulo}</h2>

                <Badge bg="info" className="receita-dificuldade">{receita.dificuldade}</Badge>
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <Image src={receita.imagemUrl} fluid className="receita-imagem w-100" />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={12}>
                        <p className="receita-descricao text-center">{receita.descricao}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={9}>
                        <h3 className="texto-bold mb-4">Ingredientes</h3>
                        <ListGroup className="receita-ingredientes mb-4">
                            {receita.ingredientes.map((ing, index) => (
                                <ListGroup.Item key={index}>
                                    {ing.quantidade} {ing.unidade} de {ing.nome}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <h3 className="texto-bold mb-4">Passos</h3>
                        {
                            console.log(receita.passos)
                        }
                        {
                            receita.passos.map((passo) => (
                                <Form.Check
                                    key={`passo-${passo.id}`}
                                    type="checkbox"
                                    id={`passo-${passo.passo}`}
                                    label={passo.descricao}
                                    checked={passosConcluidos[passo.passo]}
                                    onChange={() => handlePassoConcluido(passo.passo)}
                                    className="receita-passo mb-2"
                                />
                            ))}
                    </Col>
                    <Col md={3}>
                        <h4 className="texto-bold mb-4 text-center">Restaurantes Sugeridos</h4>
                        <div className="restaurantes-sugeridos">
                            {receita.restaurantes.slice(0, 3).map((rest) => (
                                <div key={rest.id} className="restaurante-item mb-3 subscrito">
                                    <Image src={rest.logo} fluid className="restaurante-logo" />
                                    <p className="restaurante-nome">{rest.nome}</p>
                                    <a href={rest.website} target="_blank" rel="noopener noreferrer" className="restaurante-link">
                                        Visitar website
                                    </a>
                                </div>
                            ))}
                            {receita.restaurantes.slice(3, 5).map((rest) => (
                                <div key={rest.id} className="restaurante-item mb-3">
                                    <Image src={rest.logo} fluid className="restaurante-logo" />
                                    <p className="restaurante-nome">{rest.nome}</p>
                                    <a href={rest.website} target="_blank" rel="noopener noreferrer" className="restaurante-link">
                                        Visitar website
                                    </a>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={showAvaliacaoModal} onHide={() => setShowAvaliacaoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Avalie esta receita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="avaliacao-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setAvaliacao(star)}
                                style={{ cursor: 'pointer' }}
                            >
                                {star <= avaliacao ? <FaStar color="#ffc107" /> : <FaRegStar />}
                            </span>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAvaliacaoModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSubmitAvaliacao}>
                        Enviar Avaliação
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default ReceitaDetalhesPage;