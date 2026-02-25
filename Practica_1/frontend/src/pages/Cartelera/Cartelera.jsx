import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './style.css';

const API_URL = "http://127.0.0.1:3000";

export default function Cartelera() {
    const navigate = useNavigate();
    const [peliculas, setPeliculas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [enLista, setEnLista] = useState(new Set());

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        if (!usuario) {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            try {
                const [resPeliculas, resPlaylist] = await Promise.all([
                    fetch(`${API_URL}/movie/exploration`, { method: 'GET', credentials: 'include' }),
                    fetch(`${API_URL}/user/playlist/${usuario.id}`, { method: 'GET', credentials: 'include' })
                ]);
                const dataPeliculas = await resPeliculas.json();
                if (!resPeliculas.ok) {
                    setError(dataPeliculas.error || 'Error al cargar películas');
                    setIsLoading(false);
                    return;
                }
                setPeliculas(dataPeliculas.peliculas);

                if (resPlaylist.ok) {
                    const dataPlaylist = await resPlaylist.json();
                    const ids = new Set(dataPlaylist.playlist.map(p => p.id_pelicula));
                    setEnLista(ids);
                }
            } catch (err) {
                setError("Error de red: " + err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const mostrarToast = (mensaje, tipo = 'success') => {
        setToast({ mensaje, tipo });
        setTimeout(() => setToast(null), 3000);
    };

    const agregarLista = async (id_pelicula) => {
        try {
            const response = await fetch(`${API_URL}/user/playlist/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id_usuario: usuario.id,
                    id_pelicula: id_pelicula
                })
            });
            const data = await response.json();
            if (!response.ok) {
                mostrarToast(data.error || 'Error al agregar', 'error');
                return;
            }
            setEnLista(prev => new Set([...prev, id_pelicula]));
            mostrarToast('Película añadida a tu lista de reproducción');
        } catch (err) {
            mostrarToast('Error de red: ' + err, 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    return (
        <div className="cartelera-wrapper">
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
                <button onClick={() => navigate('/editar-informacion')}>Editar información</button>
                <button onClick={() => navigate('/lista-reproduccion')}>Mi lista de reproducción</button>
                <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
            </div>

            <div className="cartelera-container">
                <h2 className="cartelera-titulo">Cartelera</h2>
                {isLoading && <p>Cargando películas...</p>}
                {error && <p className="cartelera-error">{error}</p>}
                {!isLoading && !error && peliculas.length === 0 && (
                    <p>No hay películas disponibles.</p>
                )}
                <div className="pelicula-grid">
                    {peliculas.map((pelicula) => (
                        <div key={pelicula.id_pelicula} className="pelicula-tarjeta">
                            <div className="pelicula-imagen">
                                {pelicula.poster_url
                                    ? <img src={pelicula.poster_url} alt={pelicula.titulo} />
                                    : <div className="sin-imagen">Sin imagen</div>
                                }
                            </div>
                            <div className="pelicula-info">
                                <h3>{pelicula.titulo}</h3>
                                <p><strong>Director:</strong> {pelicula.director}</p>
                                <p><strong>Año:</strong> {pelicula.anio_estreno}</p>
                                <p>
                                    <strong>URL:</strong>{' '}
                                    <a href={pelicula.url_contenido} target="_blank" rel="noreferrer">
                                        Ver contenido
                                    </a>
                                </p>
                                <p>
                                    <strong>Estado:</strong>{' '}
                                    <span className={`estado-badge ${pelicula.estado === 'Disponible' ? 'estado-disponible' : 'estado-proximo'}`}>
                                        {pelicula.estado === 'Disponible' ? 'Disponible' : 'Próximo estreno'}
                                    </span>
                                </p>
                                <div className="pelicula-acciones">
                                    {pelicula.estado === 'Disponible' ? (
                                        <button
                                            onClick={() => agregarLista(pelicula.id_pelicula)}
                                            disabled={enLista.has(pelicula.id_pelicula)}
                                            className={enLista.has(pelicula.id_pelicula) ? 'btn-ya-agregada' : ''}
                                        >
                                            {enLista.has(pelicula.id_pelicula) ? 'Ya en tu lista' : '+ Agregar a mi lista'}
                                        </button>
                                    ) : (
                                        <span className="etiqueta-proximo">Próximamente disponible</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
