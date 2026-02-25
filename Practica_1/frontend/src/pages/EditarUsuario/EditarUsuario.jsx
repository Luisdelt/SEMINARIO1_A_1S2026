import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CamaraModal from '../../components/CamaraModal/CamaraModal';
import './style.css';

const Editar_Usuario = () => {
    const navigate = useNavigate();
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mostrarCamara, setMostrarCamara] = useState(false);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        correo: '',
        contrasena_actual: ''
    });
    const [error, setError] = useState(null);
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || 'null');
    const [idUsuario, setIdUsuario] = useState(usuarioLocal?.id || null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!usuarioLocal) {
            navigate('/');
            return;
        }
        setIdUsuario(usuarioLocal.id);
        setFormData({
            nombre_completo: usuarioLocal.nombre_completo || '',
            correo: usuarioLocal.correo || '',
            contrasena_actual: ''
        });
        if (usuarioLocal.foto_perfil) {
            setPreview(usuarioLocal.foto_perfil);
        }
    }, []);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCaptura = (file) => {
        setFoto(file);
        setPreview(URL.createObjectURL(file));
        setMostrarCamara(false);
    };

    const actualizarUsuario = async (e) => {
        e.preventDefault();
        setError(null);

        const { nombre_completo, correo, contrasena_actual } = formData;

        if (!nombre_completo || !correo || !contrasena_actual) {
            setError('El nombre, correo y contraseña actual son obligatorios!');
            return;
        }
        if (!idUsuario) {
            setError('Error: Usuario no identificado');
            return;
        }

        const form = new FormData();
        form.append("id_usuario", idUsuario);
        form.append("nombre_completo", nombre_completo);
        form.append("contrasena_actual", contrasena_actual);
        if (foto) {
            form.append("foto", foto);
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/user/edit', {
                method: 'PUT',
                credentials: 'include',
                body: form
            });

            const data = await response.json();
            if (response.ok) {
                alert("Perfil actualizado con éxito");
                setFormData({ ...formData, contrasena_actual: '' });
                setFoto(null);
            } else {
                alert(data.error || "Error al actualizar usuario");
            }
        } catch (err) {
            alert("Error: " + err);
        }
    };

    return (
        <div className="form-wrapper">
            {mostrarCamara && (
                <CamaraModal
                    onCaptura={handleCaptura}
                    onCerrar={() => setMostrarCamara(false)}
                />
            )}
            <div className="form-container">
                <h2>Editar Perfil</h2>
                <button
                    type="button"
                    className="boton-regresar"
                    onClick={() => navigate('/cartelera')}
                >
                    Regresar
                </button>
                <form onSubmit={actualizarUsuario}>
                    {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

                    <label>Foto de perfil:</label>
                    <div className="foto-opciones">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                        />
                        <button
                            type="button"
                            className="btn-camara"
                            onClick={() => setMostrarCamara(true)}
                        >
                            Usar cámara
                        </button>
                    </div>
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxWidth: '100px',
                                maxHeight: '100px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                marginBottom: '10px',
                                display: 'block',
                                margin: '10px auto'
                            }}
                        />
                    )}

                    <label>Nombre completo:</label>
                    <input
                        type="text"
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleChange}
                    />

                    <label>Correo electrónico:</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        disabled
                    />

                    <label>Contraseña (requerida para confirmar):</label>
                    <input
                        type="password"
                        name="contrasena_actual"
                        value={formData.contrasena_actual}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña actual"
                    />

                    <button type="submit">Guardar cambios</button>
                </form>
            </div>
        </div>
    );
};

export default Editar_Usuario;