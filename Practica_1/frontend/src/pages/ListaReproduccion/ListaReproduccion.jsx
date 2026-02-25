import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './style.css';

const API_URL = "http://127.0.0.1:3000";

export default function ListaReproduccion() {
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        if (!usuario) {
            navigate('/');
            return;
        }
        fetchPlaylist();
    }, []);

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`${API_URL}/user/playlist/${usuario.id}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Error al cargar la lista');
                setIsLoading(false);
                return;
            }
            setPlaylist(data.playlist);
        } catch (err) {
            setError("Error de red: " + err);
        } finally {
            setIsLoading(false);
        }
    };

    const mostrarToast = (mensaje, tipo = 'success') => {
        setToast({ mensaje, tipo });
        setTimeout(() => setToast(null), 3000);
    };

    const eliminarDeLista = async (id_pelicula) => {
        try {
            const response = await fetch(`${API_URL}/user/playlist/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_usuario: usuario.id, id_pelicula })
            });
            const data = await response.json();
            if (!response.ok) {
                mostrarToast(data.error || 'Error al eliminar', 'error');
                return;
            }
            mostrarToast('Película eliminada de tu lista');
            setPlaylist(prev => prev.filter(p => p.id_pelicula !== id_pelicula));
        } catch (err) {
            mostrarToast('Error de red: ' + err, 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    return (
        <div className="lista-wrapper">
            {toast && (
                <div className={`toast-notification ${toast.tipo === 'error' ? 'toast-error' : 'toast-success'}`}>
                    {toast.mensaje}
                </div>
            )}
            <div className="slidebar">
                <div className="slidebar-user">
                    {usuario?.foto_perfil && (
                        <img src={usuario.foto_perfil} alt="Perfil" className="slidebar-avatar" />
                    )}
                    <span className="slidebar-nombre">{usuario?.nombre_completo}</span>
                </div>
                <button onClick={() => navigate('/cartelera')}>Cartelera</button>
                <button onClick={() => navigate('/editar-informacion')}>Editar información</button>
                <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
            </div>

            <div className="lista-container">
                <h2 className="lista-titulo">Mi Lista de Reproducción</h2>

                {isLoading && <p className="lista-estado">Cargando tu lista...</p>}
                {error && <p className="lista-error">{error}</p>}
                {!isLoading && !error && playlist.length === 0 && (
                    <div className="lista-vacia">
                        <p>Tu lista está vacía.</p>
                        <button onClick={() => navigate('/cartelera')}>Explorar Cartelera</button>
                    </div>
                )}

                <div className="playlist-grid">
                    {playlist.map((pelicula) => (
                        <div key={pelicula.id_pelicula} className="playlist-tarjeta">
                            <div className="playlist-imagen">
                                {pelicula.poster_url
                                    ? <img src={pelicula.poster_url} alt={pelicula.titulo} />
                                    : <div className="sin-imagen">Sin imagen</div>
                                }
                            </div>
                            <div className="playlist-info">
                                <h3>{pelicula.titulo}</h3>
                                <p><strong>Director:</strong> {pelicula.director}</p>
                                <p><strong>Año:</strong> {pelicula.anio_estreno}</p>
                                <div className="playlist-acciones">
                                    <a
                                        href={pelicula.url_contenido}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-ver"
                                    >
                                        Ver película
                                    </a>
                                    <button
                                        className="btn-eliminar"
                                        onClick={() => eliminarDeLista(pelicula.id_pelicula)}
                                    >
                                        Quitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
