import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
const Editar_Usuario = () => {
    const navigate = useNavigate();
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        correo: '',
        contrasena_actual: ''
    });
    const [error, setError] = useState(null);
    const [idUsuario, setIdUsuario] = useState(null);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3000/user/profile', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                console.log('Datos del servidor:', data);
                if (!response.ok) {
                    setError(data.error || 'Error al cargar datos');
                    return;
                }
                setIdUsuario(data.id_usuario);
                setFormData({
                    nombre_completo: data.nombre_completo || '',
                    correo: data.correo || '',
                    contrasena_actual: ''
                });
                if (data.foto_perfil) {
                    setPreview(data.foto_perfil);
                } else {
                    setPreview(null);
                }

            } catch (err) {
                setError("Error: " + err);
            }
        };
        fetchUserData();
    }, []);
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
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
                alert("Usuario actualizado con éxito");
                setFormData({ ...formData, contrasena_actual: '' });
                setFoto(null);
            } else {
                alert(data.error || "Error al actualizar usuario");
            }
        } catch (err) {
            alert("Error: " + err);
        }
    };

    return (<div className="form-wrapper">
        <div className="form-container">
            <h2>Registrar Usuario</h2>
            <button
                type="button"
                className="boton-regresar"
                onClick={() => navigate('/cartelera')}>Regresar</button>
            <form onSubmit={actualizarUsuario}>
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
                    }} />}
                <label>Nombre completo:</label>
                <input
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleChange} />

                <label>Correo electrónico:</label>
                <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    disabled />

                <label>Contraseña (requerida para confirmar):</label>
                <input
                    type="password"
                    name="contrasena_actual"
                    value={formData.contrasena_actual}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña actual" />

                <button type="submit">Editar usuario</button>
            </form>
        </div>
    </div>
    );


};

export default Editar_Usuario;