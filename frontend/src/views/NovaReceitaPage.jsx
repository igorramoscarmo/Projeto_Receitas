// src/views/NovaReceitaPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import NavBar from '../components/NavBar';
import './css/NovaReceitaPage.css';

const NovaReceitaPage = ({ currentUser, setCurrentUser }) => {
    const [receita, setReceita] = useState({
        titulo: '',
        descricao: '',
        dificuldade: 'Fácil',
        folder: '',
        bannerImage: '',
        categorias: [],
        ingredientes: [],
        passos: []
    });
    const [categorias, setCategorias] = useState([]);
    const [novoIngrediente, setNovoIngrediente] = useState({ nome: '', quantidade: '', unidade: '' });
    const [novoPasso, setNovoPasso] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    useEffect(() => {
        if (currentUser && currentUser.tipo === 1) {
            fetchCategorias();
        }
    }, [currentUser]);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get('/api/admin/categorias', { withCredentials: true });
            setCategorias(response.data);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
            setFeedback({ message: 'Erro ao carregar categorias', type: 'danger' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReceita({ ...receita, [name]: value });
    };

    const handleCategoriaChange = (e) => {
        const categoriaId = parseInt(e.target.value);
        const isChecked = e.target.checked;
        if (isChecked) {
            setReceita({ ...receita, categorias: [...receita.categorias, categoriaId] });
        } else {
            setReceita({ ...receita, categorias: receita.categorias.filter(id => id !== categoriaId) });
        }
    };

    const handleAddIngrediente = () => {
        if (novoIngrediente.nome && novoIngrediente.quantidade && novoIngrediente.unidade) {
            setReceita({
                ...receita,
                ingredientes: [...receita.ingredientes, { ...novoIngrediente, id: Date.now() }]
            });
            setNovoIngrediente({ nome: '', quantidade: '', unidade: '' });
        }
    };

    const handleRemoveIngrediente = (id) => {
        setReceita({
            ...receita,
            ingredientes: receita.ingredientes.filter(ing => ing.id !== id)
        });
    };

    const handleAddPasso = () => {
        if (novoPasso.trim()) {
            setReceita({
                ...receita,
                passos: [...receita.passos, { descricao: novoPasso, id: Date.now() }]
            });
            setNovoPasso('');
        }
    };

    const handleRemovePasso = (id) => {
        setReceita({
            ...receita,
            passos: receita.passos.filter(passo => passo.id !== id)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/receitas', receita, { withCredentials: true });
            setFeedback({ message: 'Receita criada com sucesso!', type: 'success' });
            // Limpar o formulário ou redirecionar para a página de gestão de receitas
        } catch (err) {
            console.error('Erro ao criar receita:', err);
            setFeedback({ message: 'Erro ao criar receita. Por favor, tente novamente.', type: 'danger' });
        }
    };

    if (currentUser?.tipo !== 1) {
        return (
            <>
                <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
                <Container className="mt-4">
                    <Alert variant="danger">Acesso não autorizado. Apenas administradores podem aceder a esta página.</Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <Container className="nova-receita-container mt-4">
                <h2 className="texto-extra-bold-italic mb-4 text-center">Nova Receita</h2>
                {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="titulo"
                                    value={receita.titulo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Dificuldade</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="dificuldade"
                                    value={receita.dificuldade}
                                    onChange={handleInputChange}
                                >
                                    <option value="Fácil">Fácil</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Difícil">Difícil</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descricao"
                            value={receita.descricao}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Pasta</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="folder"
                                    value={receita.folder}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Imagem de Banner</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bannerImage"
                                    value={receita.bannerImage}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Categorias</Form.Label>
                        <div className="categorias-container">
                            {categorias.map(categoria => (
                                <Form.Check
                                    key={categoria.idCategorias}
                                    type="checkbox"
                                    label={categoria.nome}
                                    value={categoria.idCategorias}
                                    onChange={handleCategoriaChange}
                                />
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ingredientes</Form.Label>
                        <div className="ingredientes-container">
                            {receita.ingredientes.map(ingrediente => (
                                <div key={ingrediente.id} className="ingrediente-item">
                                    <span>{ingrediente.quantidade} {ingrediente.unidade} de {ingrediente.nome}</span>
                                    <Button variant="link" onClick={() => handleRemoveIngrediente(ingrediente.id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex mt-2">
                            <Form.Control
                                type="text"
                                value={novoIngrediente.nome}
                                onChange={(e) => setNovoIngrediente({ ...novoIngrediente, nome: e.target.value })}
                                placeholder="Nome do ingrediente"
                                className="me-2"
                            />
                            <Form.Control
                                type="text"
                                value={novoIngrediente.quantidade}
                                onChange={(e) => setNovoIngrediente({ ...novoIngrediente, quantidade: e.target.value })}
                                placeholder="Quantidade"
                                className="me-2"
                            />
                            <Form.Control
                                type="text"
                                value={novoIngrediente.unidade}
                                onChange={(e) => setNovoIngrediente({ ...novoIngrediente, unidade: e.target.value })}
                                placeholder="Unidade"
                                className="me-2"
                            />
                            <Button onClick={handleAddIngrediente}>
                                <FaPlus />
                            </Button>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Passos</Form.Label>
                        <div className="passos-container">
                            {receita.passos.map((passo, index) => (
                                <div key={passo.id} className="passo-item">
                                    <span className="passo-numero">{index + 1}.</span>
                                    <p>{passo.descricao}</p>
                                    <Button variant="link" onClick={() => handleRemovePasso(passo.id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex mt-2">
                            <Form.Control
                                type="text"
                                value={novoPasso}
                                onChange={(e) => setNovoPasso(e.target.value)}
                                placeholder="Novo passo"
                                className="me-2"
                            />
                            <Button onClick={handleAddPasso}>
                                <FaPlus />
                            </Button>
                        </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Criar Receita
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default NovaReceitaPage;