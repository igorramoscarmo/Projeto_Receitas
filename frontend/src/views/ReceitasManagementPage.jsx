import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Table, Alert, OverlayTrigger, Tooltip, Form, Button, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit, FaEye, FaEyeSlash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import axios from 'axios';
import NavBar from '../components/NavBar';
import './css/ReceitasManagementPage.css';

const ReceitasManagementPage = ({ currentUser, setCurrentUser }) => {
    const [receitas, setReceitas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [editingReceita, setEditingReceita] = useState(null);
    const [newCategoria, setNewCategoria] = useState('');
    const [ingredientes, setIngredientes] = useState([]);
    const [novoIngrediente, setNovoIngrediente] = useState({ nome: '', quantidade: '', unidade: '' });
    const [passos, setPassos] = useState([]);
    const [novoPasso, setNovoPasso] = useState('');
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);


    const fetchReceitas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/receitas', { withCredentials: true });
            setReceitas(response.data.sort((a, b) => a.idreceitas - b.idreceitas));
        } catch (err) {
            setFeedback({ message: `Erro ao carregar receitas: ${err.response?.data?.message || err.message}`, type: 'danger' });
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategorias = useCallback(async () => {
        try {
            const response = await axios.get('/api/admin/categorias', { withCredentials: true });
            setCategorias(response.data);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
        }
    }, []);

    const fetchIngredientes = useCallback(async (receitaId) => {
        if (!receitaId) {
            console.log("ID da receita não fornecido");
            setIngredientes([]);
            return;
        }
        try {
            const response = await axios.get(`/api/admin/receitas/${receitaId}/ingredientes-passos`, { withCredentials: true });
            setIngredientes(response.data.ingredientes);
        } catch (erro) {
            console.error('Erro ao buscar ingredientes:', erro);
            setIngredientes([]);
        }
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.tipo === 1) {
            fetchReceitas();
            fetchCategorias();
            if (editingReceita) {
                fetchIngredientes(editingReceita.idreceitas);
            }
        } else {
            setFeedback({ message: 'Acesso não autorizado. Apenas administradores podem ver esta página.', type: 'danger' });
            setLoading(false);
        }
    }, [currentUser, fetchReceitas, fetchCategorias, fetchIngredientes, editingReceita]);

    useEffect(() => {
        if (isEditFormVisible && editFormRef.current) {
            setTimeout(() => {
                editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // pequeno atraso para garantir que o DOM foi atualizado
        }
    }, [isEditFormVisible]);

    const handleToggleCarousel = async (id) => {
        try {
            const response = await axios.put(`/api/admin/receitas/${id}/toggle-carousel`, {}, { withCredentials: true });
            setFeedback({ message: response.data.message, type: 'success' });
            fetchReceitas();
        } catch (err) {
            setFeedback({ message: 'Erro ao alterar status no carrossel. Por favor, tente novamente.', type: 'danger' });
        }
    };

    const handleDeleteReceita = async (id) => {
        if (window.confirm('Tem certeza que deseja apagar esta receita?')) {
            try {
                const response = await axios.delete(`/api/admin/receitas/${id}`, { withCredentials: true });
                setFeedback({ message: response.data.message, type: 'success' });
                fetchReceitas();
            } catch (err) {
                setFeedback({ message: 'Erro ao apagar receita. Por favor, tente novamente.', type: 'danger' });
            }
        }
    };

    const editFormRef = useRef(null);

    const handleEdit = async (receita) => {
        try {
            const response = await axios.get(`/api/admin/receitas/${receita.idreceitas}/ingredientes-passos`, { withCredentials: true });
            setEditingReceita({
                ...receita,
                ingredientes: response.data.ingredientes.map(ing => ({
                    ...ing,
                    selecionado: true,
                    quantidade: ing.receita_ingredientes.quantidade,
                    unidade: ing.receita_ingredientes.unidade
                })),
                passos: response.data.passos
            });
            setIngredientes(response.data.ingredientes);
            setPassos(response.data.passos);
            setIsEditFormVisible(true);
        } catch (erro) {
            console.error('Erro ao buscar ingredientes e passos:', erro);
            setFeedback({ message: 'Erro ao carregar detalhes da receita', type: 'danger' });
        }
    };

    const handleIngredienteChange = (id, field, value) => {
        setEditingReceita(prev => ({
            ...prev,
            ingredientes: prev.ingredientes.map(ing =>
                ing.id_ingrediente === id ? { ...ing, [field]: value } : ing
            )
        }));
    };

    const handleAddIngrediente = () => {
        if (novoIngrediente.nome && novoIngrediente.quantidade && novoIngrediente.unidade) {
            setEditingReceita(prev => ({
                ...prev,
                ingredientes: [
                    ...prev.ingredientes,
                    {
                        id_ingrediente: Date.now(), // ID temporário
                        nome: novoIngrediente.nome,
                        quantidade: novoIngrediente.quantidade,
                        unidade: novoIngrediente.unidade,
                        selecionado: true,
                        novo: true // Marca como novo ingrediente
                    }
                ]
            }));
            setNovoIngrediente({ nome: '', quantidade: '', unidade: '' });
        }
    };
    const handlePassoChange = (index, value) => {
        setPassos(prev => prev.map((passo, i) => i === index ? { ...passo, descricao: value } : passo));
    };

    const handleAddPasso = () => {
        if (novoPasso.trim()) {
            setPassos([...passos, { descricao: novoPasso }]);
            setNovoPasso('');
        }
    };

    const handleRemovePasso = (index) => {
        setPassos(prev => prev.filter((_, i) => i !== index));
    };

    const handleMovePasso = (index, direction) => {
        const newPassos = [...passos];
        const passo = newPassos[index];
        newPassos.splice(index, 1);
        newPassos.splice(index + direction, 0, passo);
        setPassos(newPassos);
    };


    const handleUpdateReceita = async (e) => {
        e.preventDefault();
        try {
            // Atualiza informações básicas da receita
            await axios.put(`/api/admin/receitas/${editingReceita.idreceitas}`, {
                titulo: editingReceita.titulo,
                descricao: editingReceita.descricao,
                dificuldade: editingReceita.dificuldade,
                folder: editingReceita.folder,
                bannerImage: editingReceita.bannerImage,
                categorias: editingReceita.categorias
            }, { withCredentials: true });

            // Atualiza ingredientes
            const ingredientesParaEnviar = editingReceita.ingredientes
                .filter(ing => ing.selecionado)
                .map(ing => ({
                    id_ingrediente: ing.id_ingrediente,
                    quantidade: ing.quantidade,
                    unidade: ing.unidade,
                    novo: ing.novo
                }));
            await axios.put(`/api/admin/receitas/${editingReceita.idreceitas}/ingredientes`,
                { ingredientes: ingredientesParaEnviar },
                { withCredentials: true }
            );

            // Atualiza passos
            await axios.put(`/api/admin/receitas/${editingReceita.idreceitas}/passos`,
                { passos: passos },
                { withCredentials: true }
            );

            setFeedback({ message: 'Receita atualizada com sucesso', type: 'success' });
            fetchReceitas();
            setEditingReceita(null);
        } catch (err) {
            console.error('Erro ao atualizar receita:', err);
            setFeedback({ message: 'Erro ao atualizar receita', type: 'danger' });
        }
    };




    const handleAddCategoria = async () => {
        if (newCategoria.trim()) {
            try {
                const response = await axios.post('/api/admin/categorias', { nome: newCategoria }, { withCredentials: true });
                setCategorias([...categorias, response.data]);
                setNewCategoria('');
            } catch (err) {
                setFeedback({ message: 'Erro ao adicionar categoria', type: 'danger' });
            }
        }
    };

    const handleRemoveCategoria = async (categoriaId) => {
        try {
            await axios.delete(`/api/admin/categorias/${categoriaId}`, { withCredentials: true });
            setCategorias(categorias.filter(cat => cat.idCategorias !== categoriaId));
        } catch (err) {
            setFeedback({ message: 'Erro ao remover categoria', type: 'danger' });
        }
    };

    return (
        <>
            <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="receitas-wrapper">
                <Container className="receitas-management-container">
                    <h2 className="texto-extra-bold-italic mb-4 text-center">Gestão de Receitas</h2>
                    {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}
                    {loading ? (
                        <p className='text-center'>A carregar receitas...</p>
                    ) : (
                        <>
                            <p className='text-center'>Total de receitas: {receitas.length}</p>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Título</th>
                                        <th>Categorias</th>
                                        <th>Data</th>
                                        <th>Comentários</th>
                                        <th>Favoritos</th>
                                        <th>Visitas</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receitas.map(receita => (
                                        <tr key={receita.idreceitas}>
                                            <td className='texto-pequeno'>{receita.idreceitas}</td>
                                            <td className='texto-pequeno'>{receita.titulo}</td>
                                            <td className='texto-pequeno'>{receita.categorias.map(cat => cat.nome).join(', ')}</td>
                                            <td className='texto-pequeno'>{new Date(receita.createdAt).toLocaleString()}</td>
                                            <td className='texto-pequeno'>{receita.numeroComentarios}</td>
                                            <td className='texto-pequeno'>{receita.numeroFavoritos}</td>
                                            <td className='texto-pequeno'>{receita.visitas}</td>
                                            <td>
                                                <div className="action-icon-container">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-toggle-${receita.idreceitas}`}>
                                                            {receita.ativoCarousel ? "Remover do Carrossel" : "Adicionar ao Carrossel"}
                                                        </Tooltip>}
                                                    >
                                                        <span onClick={() => handleToggleCarousel(receita.idreceitas)} className="action-icon">
                                                            {receita.ativoCarousel ? <FaEye /> : <FaEyeSlash />}
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-edit-${receita.idreceitas}`}>Editar Receita</Tooltip>}
                                                    >
                                                        <span onClick={() => handleEdit(receita)} className="action-icon">
                                                            <FaEdit />
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-delete-${receita.idreceitas}`}>Apagar Receita</Tooltip>}
                                                    >
                                                        <span onClick={() => handleDeleteReceita(receita.idreceitas)} className="action-icon">
                                                            <FaTrash />
                                                        </span>
                                                    </OverlayTrigger>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {isEditFormVisible && editingReceita && (
                                <Form ref={editFormRef}  onSubmit={handleUpdateReceita} className="edit-receita-form mt-4">
                                    <h3 className="texto-bold mb-3">Editar Receita</h3>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Título</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editingReceita.titulo}
                                                    onChange={(e) => setEditingReceita({ ...editingReceita, titulo: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Dificuldade</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={editingReceita.dificuldade}
                                                    onChange={(e) => setEditingReceita({ ...editingReceita, dificuldade: e.target.value })}
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
                                            value={editingReceita.descricao}
                                            onChange={(e) => setEditingReceita({ ...editingReceita, descricao: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Pasta</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editingReceita.folder}
                                                    onChange={(e) => setEditingReceita({ ...editingReceita, folder: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Imagem de Banner</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editingReceita.bannerImage}
                                                    onChange={(e) => setEditingReceita({ ...editingReceita, bannerImage: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Categorias</Form.Label>
                                        <div className="categorias-container">
                                            {categorias.map(categoria => (
                                                <div key={categoria.idCategorias} className="categoria-item">
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={editingReceita.categorias.some(cat => cat.idCategorias === categoria.idCategorias)}
                                                        onChange={(e) => {
                                                            const updatedCategorias = e.target.checked
                                                                ? [...editingReceita.categorias, categoria]
                                                                : editingReceita.categorias.filter(cat => cat.idCategorias !== categoria.idCategorias);
                                                            setEditingReceita({ ...editingReceita, categorias: updatedCategorias });
                                                        }}
                                                    />
                                                    <Button
                                                        variant="link"
                                                        className="categoria-remove"
                                                        onClick={() => handleRemoveCategoria(categoria.idCategorias)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                    <span className="categoria-nome">{categoria.nome}</span>

                                                </div>
                                            ))}
                                        </div>
                                        <div className="d-flex mt-2">
                                            <Form.Control
                                                type="text"
                                                value={newCategoria}
                                                onChange={(e) => setNewCategoria(e.target.value)}
                                                placeholder="Nova categoria"
                                                className="me-2"
                                            />
                                            <Button onClick={handleAddCategoria}>
                                                <FaPlus />
                                            </Button>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ingredientes</Form.Label>
                                        <div className="ingredientes-header d-flex mb-2">
                                            <div style={{ width: '20%' }}>Quantidade</div>
                                            <div style={{ width: '30%' }}>Unidade</div>
                                            <div style={{ width: '50%' }}>Ingrediente</div>
                                        </div>
                                        {editingReceita.ingredientes.map((ingrediente, index) => (
                                            <div key={index} className="ingrediente-item d-flex align-items-center mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={ingrediente.selecionado}
                                                    onChange={(e) => handleIngredienteChange(ingrediente.id_ingrediente, 'selecionado', e.target.checked)}
                                                    className="me-2"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    value={ingrediente.quantidade}
                                                    onChange={(e) => handleIngredienteChange(ingrediente.id_ingrediente, 'quantidade', e.target.value)}
                                                    className="me-2"
                                                    style={{ width: '18%' }}
                                                />
                                                <Form.Control
                                                    type="text"
                                                    value={ingrediente.unidade}
                                                    onChange={(e) => handleIngredienteChange(ingrediente.id_ingrediente, 'unidade', e.target.value)}
                                                    className="me-2"
                                                    style={{ width: '28%' }}
                                                />
                                                <Form.Control
                                                    type="text"
                                                    value={ingrediente.nome}
                                                    onChange={(e) => handleIngredienteChange(ingrediente.id_ingrediente, 'nome', e.target.value)}
                                                    style={{ width: '48%' }}
                                                />
                                            </div>
                                        ))}
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button variant="primary" onClick={handleAddIngrediente} className="mt-2">
                                                Adicionar Ingrediente
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Passos</Form.Label>
                                        <div className="passos-container">
                                            {passos.map((passo, index) => (
                                                <div key={index} className="passo-item">
                                                    <span className="passo-numero">{index + 1}.</span>
                                                    <Form.Control
                                                        as="textarea"
                                                        value={passo.descricao}
                                                        onChange={(e) => handlePassoChange(index, e.target.value)}
                                                        className="passo-descricao"
                                                    />
                                                    <div className="passo-acoes">
                                                        <Button variant="link" onClick={() => handleMovePasso(index, -1)} disabled={index === 0}>
                                                            <FaArrowUp />
                                                        </Button>
                                                        <Button variant="link" onClick={() => handleMovePasso(index, 1)} disabled={index === passos.length - 1}>
                                                            <FaArrowDown />
                                                        </Button>
                                                        <Button variant="link" onClick={() => handleRemovePasso(index)}>
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
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

                                    <div className="d-flex justify-content-end mt-3">
                                        <Button variant="secondary" onClick={() => setEditingReceita(null)} className="me-2">
                                            Cancelar
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </>
                    )}
                </Container>
            </div>
        </>
    );
};

export default ReceitasManagementPage;