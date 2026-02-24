import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import './style.css';

const Registrar_Usuario = () => {
    const navigate = useNavigate();
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarContrasenaConfirmada, setMostrarContrasenaConfirmada] = useState(false);

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
    }
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
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
                setError("Error al registrar usuario");
            }

        } catch (err) {
            setError("Error de red");
        }
    };

    return (<div className="form-wrapper">
        <div className="form-container">
            <h2>Registrar Usuario</h2>
            <button
                type="button"
                className="boton-regresar"
                onClick={() => navigate('/')}>Regresar</button>
            <form onSubmit={registraUsuario}>
                <label>Foto de perfil:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}></input>
                {preview && <img src={preview} alt="Preview" 
                style={{ 
                    maxWidth: '100px', 
                    maxHeight: '100px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginBottom: '10px',
                    display: 'block',
                    margin: '10px auto'
                }}/>}
                <label>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange} />

                <label>Apellidos:</label>
                <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange} />

                <label>Correo electrónico:</label>
                <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange} />

                <label>Contraseña:</label>
                <input
                    type={mostrarContrasena ? "text" : "password"}
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange} />
                <span className="toggle-password" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                    {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                </span>

                <label>Confirmar Contraseña:</label>
                <input
                    type={mostrarContrasenaConfirmada ? "text" : "password"}
                    name="contrasena_confirmada"
                    value={formData.contrasena_confirmada}
                    onChange={handleChange} />
                <span className="toggle-password" onClick={() => setMostrarContrasenaConfirmada(!mostrarContrasenaConfirmada)}>
                    {mostrarContrasenaConfirmada ? <FaEyeSlash /> : <FaEye />}
                </span>

                <button type="submit">Crear usuario</button>
            </form>
        </div>
    </div>
    );


};

export default Registrar_Usuario;