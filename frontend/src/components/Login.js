import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card, Stack } from 'react-bootstrap';
import './style.css';
require('dotenv').config();

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const isTokenExpired = useCallback((token) => {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    }, []);

    const checkTokenAndNavigate = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            navigate('/consulta'); // Si el token aún es válido, redirige automáticamente
        }
    }, [isTokenExpired, navigate]);

    useEffect(() => {
        checkTokenAndNavigate();
    }, [checkTokenAndNavigate]);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/consulta');
        } catch (error) {
            alert(error.response?.data.message || 'Error de conexión');
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="custom-header text-white text-center py-3">
                <h1>Inicio de Sesión</h1>
            </header>
            <main className="flex-grow-1">
                <Container className="mt-5">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Card className="shadow-lg">
                                <Card.Header className="text-center bg-light">
                                    <Stack direction="horizontal" gap={5} className="justify-content-center align-items-center">
                                        <img
                                            src="/FARMATOOLS.png"
                                            alt="Logo 1"
                                            style={{ height: "85px", width: "auto" }}
                                        />
                                        <img
                                            src="/logo HEAC.png"
                                            alt="Logo 2"
                                            style={{ height: "85px", width: "auto" }}
                                        />
                                        <img
                                            src="/logo FUNDAGES.png"
                                            alt="Logo 3"
                                            style={{ height: "85px", width: "auto" }}
                                        />
                                    </Stack>
                                </Card.Header>
                                <Card.Body>
                                    <h2 className="text-center">Ingrese sus datos</h2>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="formUsername">
                                            <Form.Label>Nombre de Usuario</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ingrese su usuario"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formPassword">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Ingrese su contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className="d-grid">
                                            <Button variant="success" onClick={handleLogin}>
                                                Ingresar
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
            <footer className="bg-light text-center py-3">
                <p>&copy; 2024 Soporte Tecnológico - HEAC. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default Login;
