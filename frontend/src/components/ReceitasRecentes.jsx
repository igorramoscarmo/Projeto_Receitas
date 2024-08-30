import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaStar, FaComment } from 'react-icons/fa';
import axios from 'axios';
import ReceitaCard from './ReceitaCard';
import './css/ReceitasRecentes.css';

const ReceitasRecentes = () => {
    const [receitas, setReceitas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ordenacao, setOrdenacao] = useState('data');

    const fetchReceitasRecentes = useCallback(async (page, orderBy = ordenacao) => {
        try {
            const response = await axios.get(`/api/receitas/recentes?page=${page}&limit=5&orderBy=${orderBy}`);
            if (page === 1) {
                setReceitas(response.data.receitas);
            } else {
                setReceitas(prevReceitas => [...prevReceitas, ...response.data.receitas]);
            }
            setCurrentPage(response.data.currentPage);
            setHasMore(response.data.hasMore);
        } catch (erro) {
            console.error('Erro ao buscar receitas recentes:', erro);
        }
    }, [ordenacao]);

    useEffect(() => {
        fetchReceitasRecentes(1);
    }, [fetchReceitasRecentes]);

    const handleVerMais = () => {
        fetchReceitasRecentes(currentPage + 1);
    };

    const handleOrdenacao = (novaOrdenacao) => {
        setOrdenacao(novaOrdenacao);
        setCurrentPage(1);
        fetchReceitasRecentes(1, novaOrdenacao);
    };

    return (
        <div className="receitas-recentes-wrapper">
            <Container fluid="xl" className="recentes-container px-4">
                <Row className="align-items-center mb-4">
                    <Col xs={12} className="text-center mb-3">
                        <h2 className="texto-extra-bold-italic">Novas receitas...</h2>
                    </Col>
                </Row>
                <Row className="justify-content-end mb-3">
                    <Col xs="auto" className="ordenacao-container">
                        <span className="texto-normal">Ordenar por: </span>
                        <Button
                            variant="link"
                            onClick={() => handleOrdenacao('avaliacao')}
                            className={ordenacao === 'avaliacao' ? 'active' : ''}
                        >
                            <FaStar />
                        </Button>
                        <Button
                            variant="link"
                            onClick={() => handleOrdenacao('comentarios')}
                            className={ordenacao === 'comentarios' ? 'active' : ''}
                        >
                            <FaComment />
                        </Button>
                    </Col>
                </Row>
            </Container>
            {receitas.map((receita, index) => (
                <div key={receita.id} className={`receita-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <Container fluid="xl" className="recentes-container px-4">
                        <ReceitaCard receita={receita} />
                    </Container>
                </div>
            ))}
            <Container fluid="xl" className="receitas-recentes-wrapper px-4 text-center mt-4">
                {hasMore ? (
                    <Button className="ver-mais-btn texto-normal" onClick={handleVerMais}>Ver mais receitas!</Button>
                ) : (
                    <p className="texto-normal">Não há mais receitas para mostrar.</p>
                )}
            </Container>
        </div>
    );
};

export default ReceitasRecentes;