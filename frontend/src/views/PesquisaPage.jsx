// src/views/PesquisaPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import ReceitaCard from '../components/ReceitaCard';
import RestauranteCard from '../components/RestauranteCard';
import SearchBar from '../components/SearchBar';
import RestaurantesDestaque from '../components/RestaurantesDestaque';
import Footer from '../components/Footer';
import './css/PesquisaPage.css';

const PesquisaPage = ({ currentUser, setCurrentUser }) => {
    const [resultados, setResultados] = useState({ receitas: [], restaurantes: [] });
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalRestaurantes, setTotalRestaurantes] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const termo = searchParams.get('termo');
        
        if (termo) {
            realizarPesquisa(termo);
        }
    }, [location]);

    const realizarPesquisa = async (termo) => {
        try {
            const response = await axios.get(`/api/receitas/pesquisa?termo=${termo}`);
            setResultados({
                receitas: response.data.resultados.filter(item => item.tipo === 'receita'),
                restaurantes: response.data.resultados.filter(item => item.tipo === 'restaurante')
            });
            setTotalReceitas(response.data.totalReceitas);
            setTotalRestaurantes(response.data.totalRestaurantes);
        } catch (erro) {
            console.error('Erro ao realizar pesquisa:', erro);
        }
    };

    const searchParams = new URLSearchParams(location.search);
    const termo = searchParams.get('termo');

    return (
        <>
            <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="main-content">
                <SearchBar initialTerm={termo} />
                <Container fluid="xl" className="pesquisa-container px-4">
                    <h2 className="text-center mb-4 texto-extra-bold-italic">Pesquisa</h2>
                    <p className="text-center mb-4">
                        Encontrados {totalReceitas} receitas e {totalRestaurantes} restaurantes
                    </p>
                    
                    {resultados.restaurantes.length > 0 && (
                        <>
                            <h3 className="text-center mb-4 texto-bold">Restaurantes encontrados</h3>
                            <Row className="justify-content-center">
                                {resultados.restaurantes.map((restaurante) => (
                                    <RestauranteCard key={restaurante.id} restaurante={restaurante} />
                                ))}
                            </Row>
                        </>
                    )}

                    {resultados.receitas.length > 0 && (
                        <>
                            <h3 className="text-center mb-4 texto-bold mt-5">Receitas encontradas</h3>
                            {resultados.receitas.map((receita, index) => (
                                <div key={receita.id} className={`receita-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <ReceitaCard receita={receita} />
                                </div>
                            ))}
                        </>
                    )}
                </Container>
                <RestaurantesDestaque />
                <Footer />
            </div>
        </>
    );
};

export default PesquisaPage;