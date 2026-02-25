import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CamaraModal from '../../components/CamaraModal/CamaraModal';
import './style.css';

const Registrar_Usuario = () => {
    const navigate = useNavigate();
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarContrasenaConfirmada, setMostrarContrasenaConfirmada] = useState(false);
    const [mostrarCamara, setMostrarCamara] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        contrasena_confirmada: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const registraUsuario = async (e) => {
        e.preventDefault();
        setError(null);

        const { nombre, apellidos, correo, contrasena, contrasena_confirmada } = formData;

        if (!nombre || !apellidos || !correo || !contrasena || !contrasena_confirmada) {
            setError('Todos los campos son obligatorios!');
            return;
        }

        if (contrasena !== contrasena_confirmada) {
            setError('Las contraseñas no coinciden!');
            return;
        }

        const form = new FormData();
        form.append("nombre_completo", `${nombre} ${apellidos}`);
        form.append("correo", correo);
        form.append("contrasena", contrasena);
        form.append("confirmar_contrasena", contrasena_confirmada);
        if (foto) {
            form.append("foto", foto);
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/user/register', {
                method: 'POST',
                body: form
            });

            if (response.ok) {
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.error || "Error al registrar usuario");
            }
        } catch (err) {
            setError("Error de red");
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
                <h2>Registrar Usuario</h2>
                <button
                    type="button"
                    className="boton-regresar"
                    onClick={() => navigate('/')}
                >
                    Regresar
                </button>
                <form onSubmit={registraUsuario}>
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
                                margin: '10px auto',
                                display: 'block'
                            }}
                        />
                    )}

                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />

                    <label>Apellidos:</label>
                    <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                    />

                    <label>Correo electrónico:</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                    />

                    <label>Contraseña:</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                        <span className="toggle-password" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                            {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <label>Confirmar Contraseña:</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={mostrarContrasenaConfirmada ? "text" : "password"}
                            name="contrasena_confirmada"
                            value={formData.contrasena_confirmada}
                            onChange={handleChange}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                        <span className="toggle-password" onClick={() => setMostrarContrasenaConfirmada(!mostrarContrasenaConfirmada)}>
                            {mostrarContrasenaConfirmada ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button type="submit">Crear usuario</button>
                </form>
            </div>
        </div>
    );
};

export default Registrar_Usuario;