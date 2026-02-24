import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://127.0.0.1:5000";
import './style.css';
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('El correo y la contraseña son obligatorios.');
            return;
        }
    
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: username, password }),
            });

            const data = await response.json();
            console.log('Respuesta del backend:', data);

            if (!response.ok) {
                setError(data.message || 'Error en el servidor');
                setIsLoading(false);
                return;
            }

            if (data.status !== 'success') {
                setError(data.message || 'Credenciales inválidas');
                setIsLoading(false);
                return;
            }

            console.log('Login successful:', data);
            alert('Login successful!');

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                console.log(data.token);
            }
            navigate('/cartelera');
        } catch (error) {
            console.error('Login error:', error);
            setError('Error de red. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className='login-wrapper'>
            <div className='login-container'>
                <h1>Login</h1>
                {error && (
                    <div className='login-error'>
                        {error}
                    </div>
                )}
                <div>
                    <input
                        type="email"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (emailRegex.test(e.target.value)) {
                                setError('');
                            } else {
                                setError('Formato de correo invalido. Ej de ingreso. @gmail.com');
                            }
                        }}
                        placeholder='Correo electrónico'
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                        className='login-input'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Contraseña'
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                        className='login-input'
                    />
                </div>
                <div>
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className = 'login-button'
                    >
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/registrar-usuario')}
                        className='login-button'
                    >
                        Registrar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
}
