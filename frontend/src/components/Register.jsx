// Register.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import authService from '../services/authService';
import './css/AuthStyles.css';

const Register = ({ setCurrentUser, closeModal }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(username, email, password);
            setSuccess('Registo efetuado com sucesso! A iniciar sessão...');
            setTimeout(async () => {
                const loginData = await authService.login(email, password);
                setCurrentUser(loginData.user);
                closeModal();
            }, 1500);
        } catch (error) {
            setError('Falha no registo. ' + (error.response?.data?.message || 'Por favor, tenta novamente.'));
        }
    };

    return (
        <Form onSubmit={handleRegister} className="auth-form">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button type="submit" className="btn-primary">Registar</Button>
        </Form>
    );
};

export default Register;