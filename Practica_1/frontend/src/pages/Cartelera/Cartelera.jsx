import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './style.css';
const API_URL = "http://127.0.0.1:5000";

export default function Cartelera() {
    const navigate = useNavigate();
    const [peliculas, setPeliculas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const response = await fetch(`${API_URL}/peliculas`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message);
                    setIsLoading(false);
                    return;
                }
                setPeliculas(data.peliculas);
            } catch (err) {
                setError("Error:"+ err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPeliculas();
    }, []);
    const agregarLista = async (peliculaId) => {
        try {
            const response = await fetch(`${API_URL}/lista`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ peliculaId })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return
            }
            alert(data.message);
        } catch (err) {
            alert("Error:"+ err);
        }
    };
    return (
        <div className="cartelera-wrapper">
            <div className="slidebar">
                <button onClick={() => navigate('/editar-informacion')}>Editar información</button>
                <button onClick={() => navigate('/lista-reproduccion')}>Mi lista de reproducción</button>
            </div>

            <div className="cartelera-container">
                {isLoading && <p>Cargando películas...</p>}
                {error && <p >{error}</p>}
                {!isLoading && !error && peliculas.length === 0 && (<p>No hay películas disponibles.</p>)}
                {peliculas.map((pelicula) => (
                    <div key={pelicula.id} className="pelicula-tarjeta">
                        <div className="pelicula-imagen">
                            <img src={pelicula.imagen} alt={pelicula.titulo} />
                        </div>
                        <div className="pelicula-info">
                            <p><strong>Titulo:</strong>{pelicula.titulo}</p>
                            <p><strong>Director:</strong>{pelicula.director}</p>
                            <p><strong>Año:</strong>{pelicula.año}</p>
                            <p><strong>URL:</strong>{pelicula.url}</p>
                            <p><strong>Estado:</strong>{pelicula.estado}</p>
                        </div>
                        <div className="pelicula-acciones">
                            <button onClick={() => agregarLista(pelicula.id)}>Agregar a mi lista</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


