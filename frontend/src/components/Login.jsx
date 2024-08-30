import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import authService from '../services/authService';
import './css/AuthStyles.css';

const Login = ({ setCurrentUser, closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login(email, password);
            setSuccess('Sessão iniciada com sucesso!');
            setTimeout(() => {
                setCurrentUser(data.user);
                closeModal();
            }, 1500);
        } catch (error) {
            setError('Falha no início de sessão. Por favor, verifica as tuas credenciais.');
        }
    };

    return (
        <Form onSubmit={handleLogin} className="auth-form">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
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
            <Button type="submit" className="btn-primary">Login</Button>
        </Form>
    );
};

export default Login;