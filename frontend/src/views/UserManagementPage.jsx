// src/views/UserManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaCircle, FaLock, FaUnlock, FaUserShield, FaUserMinus } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import './css/UserManagementPage.css';

const UserManagementPage = ({ currentUser, setCurrentUser }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('username');
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/users', { withCredentials: true });
            setUsers(sortUsers(response.data, sortField, sortOrder));
        } catch (err) {
            setError(`Erro ao carregar utilizadores: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, [sortField, sortOrder]);

    useEffect(() => {
        if (currentUser && currentUser.tipo === 1) {
            fetchUsers();
        } else {
            setError('Acesso não autorizado. Apenas administradores podem ver esta página.');
            setLoading(false);
        }
    }, [currentUser, fetchUsers]);

    const sortUsers = (usersToSort, field, order) => {
        return [...usersToSort].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (field) => {
        const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
        setUsers(sortUsers(users, field, newOrder));
    };

    const handleBlockUser = async (userId) => {
        try {
            const response = await axios.put(`/api/admin/users/${userId}/block`, {}, { withCredentials: true });
            setFeedback({ message: response.data.message, type: 'success' });
            fetchUsers();
        } catch (err) {
            setFeedback({ message: 'Erro ao bloquear/desbloquear utilizador. Por favor, tenta novamente.', type: 'danger' });

            console.log(error);
        }
    };

    const handleToggleAdmin = async (userId) => {
        if (userId === currentUser.id) {
            setFeedback({ message: 'Não é possível remover os teus próprios privilégios de administrador.', type: 'warning' });
            return;
        }
        try {
            const response = await axios.put(`/api/admin/users/${userId}/admin`, {}, { withCredentials: true });
            setFeedback({ message: response.data.message, type: 'success' });
            fetchUsers();
        } catch (err) {
            setFeedback({ message: 'Erro ao alterar estatuto de administrador. Por favor, tenta novamente.', type: 'danger' });
        }
    };

    const renderIcon = (condition, TrueIcon, FalseIcon, trueTip, falseTip, trueColor = "#98a66c", falseColor = "#a34343") => (
        <OverlayTrigger
            placement="top"
            overlay={(props) => (
                <Tooltip id={`tooltip-${condition ? 'true' : 'false'}`} {...props}>
                    {condition ? trueTip : falseTip}
                </Tooltip>
            )}
        >
            <span>{condition ? <TrueIcon color={trueColor} /> : <FalseIcon color={falseColor} />}</span>
        </OverlayTrigger>
    );

    return (
        <>
            <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="users-wrapper">
                <Container fluid="xl" className="user-management-container">
                    <h2 className="texto-extra-bold-italic mb-4 text-center">Gestão de Utilizadores</h2>
                    {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}
                    {loading ? (
                        <p className='text-center'>A carregar utilizadores...</p>
                    ) : (
                        <>
                            {currentUser && currentUser.tipo === 1 ? (
                                <>
                                    <p className='text-center'>Total de utilizadores: {users.length}</p>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('username')}>Username</th>
                                                <th onClick={() => handleSort('email')}>Email</th>
                                                <th onClick={() => handleSort('ultimoLogin')}>Último Login</th>
                                                <th onClick={() => handleSort('estaLogado')}>Logado</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.idutilizador} className={user.idutilizador === currentUser.id ? 'current-user' : ''}>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.ultimoLogin ? new Date(user.ultimoLogin).toLocaleString() : 'N/A'}</td>
                                                    <td className="text-center">
                                                        {renderIcon(user.estaLogado, FaCircle, FaCircle, "Logado", "Não logado")}
                                                    </td>
                                                    <td>
                                                        <div className="action-icon-container">
                                                            {user.idutilizador !== currentUser.id && (
                                                                <>
                                                                    <span onClick={() => handleBlockUser(user.idutilizador)} className="action-icon">
                                                                        {renderIcon(!user.bloqueado, FaLock, FaUnlock, "Bloquear", "Desbloquear", )}
                                                                    </span>
                                                                    <span onClick={() => handleToggleAdmin(user.idutilizador)} className="action-icon">
                                                                        {renderIcon(user.idTipo !== 1, FaUserShield, FaUserMinus, "Tornar Admin", "Remover Admin")}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </>
                            ) : (
                                <Alert variant="warning">
                                    Você não tem permissão para ver esta página. Faça login como administrador.
                                </Alert>
                            )}
                        </>
                    )}
                </Container>
            </div>
        </>
    );
};

export default UserManagementPage;