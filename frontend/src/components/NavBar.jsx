// src/components/NavBar.jsx

import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaHeart, FaPlus, FaUsers, FaUserCheck, FaUserPlus, FaBookOpen } from 'react-icons/fa';
import authService from '../services/authService';
import Login from './Login';
import Register from './Register';
import './css/NavBar.css';
import './css/AuthStyles.css';

const NavBar = ({ currentUser, setCurrentUser }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

    const logOut = async () => {
        await authService.logout();
        setCurrentUser(null);
        navigate('/');
    };

    const handleShowLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => setShowLoginModal(false);

    const handleShowRegisterModal = () => setShowRegisterModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);

    const iconWithTooltip = (icon, text, onClick = null, to = null) => (
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{text}</Tooltip>}
        >
            {to ? (
                <Nav.Link as={Link} to={to}>{icon}</Nav.Link>
            ) : (
                <Nav.Link onClick={onClick}>{icon}</Nav.Link>
            )}
        </OverlayTrigger>
    );

    return (
        <>
            <Navbar expand="md" className="navbar">
                <Container fluid="xl" className="navbar-container px-4">
                    <div className="d-flex align-items-center">
                        <Navbar.Brand as={Link} to="/" className="logo-container">
                            <div className="logo-background">
                                <img src="/assets/Logo.png" className="logo" alt="PapaEats Logo" />
                            </div>
                        </Navbar.Brand>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="auth-icons">
                            {currentUser ? (
                                <>
                                    <span className="user-name texto-normal me-3">Olá {currentUser.username}</span>
                                    {currentUser.tipo === 2 && iconWithTooltip(<FaHeart />, "Favoritas")}
                                    {currentUser.tipo === 1 && (
                                        <>
                                            {iconWithTooltip(<FaPlus />, "Adicionar Receita", null, "/admin/nova-receita")}
                                            {iconWithTooltip(<FaBookOpen />, "Gerir Receitas", null, "/admin/receitas")}
                                            {iconWithTooltip(<FaUsers />, "Gerir Utilizadores", null, "/admin/users")}
                                        </>
                                    )}
                                    {iconWithTooltip(<FaUser />, "Perfil")}
                                    {iconWithTooltip(<FaSignOutAlt />, "Terminar sessão", logOut)}
                                </>
                            ) : (
                                <>
                                    {iconWithTooltip(<FaUserCheck />, "Iniciar sessão", handleShowLoginModal)}
                                    {iconWithTooltip(<FaUserPlus />, "Registo", handleShowRegisterModal)}
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </Navbar>

            <Modal show={showLoginModal} onHide={handleCloseLoginModal} className="auth-modal">
                <Modal.Header closeButton>
                    <Modal.Title className='modal-t texto-extra-bold-italic'>Iniciar Sessão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login setCurrentUser={setCurrentUser} closeModal={handleCloseLoginModal} />
                </Modal.Body>
            </Modal>

            <Modal show={showRegisterModal} onHide={handleCloseRegisterModal} className="auth-modal">
                <Modal.Header closeButton>
                    <Modal.Title className='modal-t texto-extra-bold-italic'>Registo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Register
                        setCurrentUser={setCurrentUser}
                        closeModal={handleCloseRegisterModal}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NavBar;