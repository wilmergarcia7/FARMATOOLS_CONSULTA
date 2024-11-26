import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container, Form, Row, Col, Stack } from "react-bootstrap";
import { format } from "date-fns";


function Consulta() {
  const [identidad, setIdentidad] = useState("");
  const [resultados, setResultados] = useState([]);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const navigate = useNavigate();

  // Manejo de cierre de sesión
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  // Función para decodificar el JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  // Validar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const interval = setInterval(() => {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken?.exp < currentTime) {
          handleLogout();
        }
      }, 1000);

      return () => clearInterval(interval); // Limpieza del intervalo
    }
  }, [navigate, handleLogout]);

  // Buscar identidad
  const buscarIdentidad = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://192.168.88.25:9100/api/consulta?identidad=${identidad}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length > 0) {
        const { nombre, apellid1, apellid2 } = response.data[0];
        setNombreCompleto(`${nombre} ${apellid1} ${apellid2}`);
      } else {
        setNombreCompleto("Sin datos");
      }

      const resultadosConFechaFormateada = response.data.map((item) => ({
        ...item,
        fecha: format(new Date(item.fecha), "dd/MM/yyyy hh:mm a"),
      }));

      setResultados(resultadosConFechaFormateada);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Token no autorizado. Por favor, inicia sesión nuevamente.");
        handleLogout();
      } else {
        alert(error.response?.data.message || "Error de conexión");
      }
    }
  };

  // Función de impresión
  const imprimir = () => {
    const encabezado = `
      <html>
        <head>
          <title>Vista previa - Historial de Dispensaciones</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .content {
              padding: 20px;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #ddd;
              padding-bottom: 10px;
            }
            .header img {
              height: 50px;
            }
            .header h1 {
              flex-grow: 1;
              text-align: center;
              margin: 0;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th, .table td {
              padding: 8px 10px;
              border: 1px solid #ddd;
              text-align: center;
            }
            .table th {
              background-color: #f2f2f2;
            }
            .footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              text-align: center;
              font-size: 12px;
              padding: 10px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <div class="header">
              <img src="/logo HEAC.png" alt="HEAC Logo" />
              <h1>Historial de Dispensaciones</h1>
              <img src="/logo FUNDAGES.png" alt="FUNDAGES Logo" />
            </div>
            <div>
              <p><strong>Nombre:</strong> ${nombreCompleto}</p>
              <p><strong>Identidad:</strong> ${identidad}</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  ${resultados
                    .map(
                      (item, index) => `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${item.fecha}</td>
                          <td>${item.des_farma}</td>
                          <td>${item.cantidad}</td>
                        </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="footer">
            <p>2024 Soporte Tecnológico - HEAC. Todos los derechos reservados.</p>
          </div>
          <script>
            window.onload = function () {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `;

    const ventanaImpresion = window.open("", "_blank", "width=900,height=700");
    ventanaImpresion.document.write(encabezado);
    ventanaImpresion.document.close();
  };

  // Limpiar la búsqueda
  const limpiarBusqueda = () => {
    setIdentidad("");
    setResultados([]);
    setNombreCompleto("");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="custom-header text-white text-center py-3">
        <Stack direction="horizontal" gap={3} className="align-items-center">
          <div className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              Salir
            </Button>
          </div>
          <div className="mx-auto">
            <h1>Historial de Dispensaciones</h1>
          </div>
          <div className="me-auto">
            <img src="/logo HEAC.png" alt="HEAC" style={{ height: "50px" }} />
            <img src="/logo FUNDAGES.png" alt="FUNDAGES" style={{ height: "50px" }} />
          </div>
        </Stack>
      </header>

      <main className="flex-grow-1">
        <Container className="mt-4">
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Ingrese identidad"
                  value={identidad}
                  onChange={(e) => setIdentidad(e.target.value)}
                />
              </Col>
              <Col>
                <Button variant="primary" onClick={buscarIdentidad}>
                  Buscar
                </Button>
                <Button variant="secondary" onClick={limpiarBusqueda} className="ms-2">
                  Limpiar
                </Button>
                <Button variant="secondary" onClick={imprimir} className="ms-2">
                  Imprimir
                </Button>
              </Col>
            </Row>
          </Form>
          <p><strong>Nombre:</strong> {nombreCompleto}</p>
          <p><strong>Identidad:</strong> {identidad}</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.fecha}</td>
                  <td>{item.des_farma}</td>
                  <td>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </main>

      <footer className="bg-light text-center py-3">
        <p>2024 Soporte Tecnológico - HEAC. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Consulta;
