import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Editar_Usuario = () => {
    const navigate = useNavigate();
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
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
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/user', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message);
                    return;
                }
                setFormData({
                    nombre: data.nombre || '',
                    apellidos: data.apellidos || '',
                    correo: data.correo || '',
                    contrasena: '',
                    contrasena_confirmada: ''
                });
                if (data.foto) {
                    setPreview(data.foto);
                }

            } catch (err) {
                setError("Error:"+ err);
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

        const { nombre, apellidos, correo, contrasena, contrasena_confirmada } = formData;
        
        if (!nombre || !apellidos || !correo ) {
            setError('Todos los campos son obligatorios!');
            return;
        }
        if (contrasena && contrasena !== contrasena_confirmada) {
            setError('Las contraseñas no coinciden!');
            return;
        }
        const form = new FormData();
        form.append("nombre", nombre);
        form.append("apellidos", apellidos);
        form.append("correo", correo);
        if (contrasena){
            form.append("contrasena", contrasena);
        }
        if(foto){
            form.append("foto", foto);
        }
        
        const response = await fetch('http://127.0.0.1:5000/edit', {
            method: 'PUT',
            credentials: 'include',
            body: form
        });
        
        const data = await response.json();
        if (response.ok) {
            alert("Usuario actualizado con éxito");
        } else {
            alert("Error al actualizar usuario");
        }
    };

    return (<div class="form-wrapper">
        <div class="form-container">
            <h2>Registrar Usuario</h2>
            <button
                type="button"
                className="boton-regresar"
                onClick={() => navigate('/')}>Regresar</button>
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
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange} />

                <label>Confirmar Contraseña:</label>
                <input
                    type="password"
                    name="contrasena_confirmada"
                    value={formData.contrasena_confirmada}
                    onChange={handleChange} />

                <button type="submit">Editar usuario</button>
            </form>
        </div>
    </div>
    );


};

export default Editar_Usuario;