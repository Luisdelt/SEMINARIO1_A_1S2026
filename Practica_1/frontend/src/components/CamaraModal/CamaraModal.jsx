import { useRef, useState, useEffect } from 'react';
import './CamaraModal.css';

export default function CamaraModal({ onCaptura, onCerrar }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);
    const [capturada, setCapturada] = useState(null);
    const [listo, setListo] = useState(false);

    useEffect(() => {
        iniciarCamara();
        return () => detenerCamara();
    }, []);

    const iniciarCamara = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setListo(true);
            }
        } catch (err) {
            setError('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
        }
    };

    const detenerCamara = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const tomarFoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturada(dataUrl);
    };

    const repetir = () => {
        setCapturada(null);
    };

    const confirmar = () => {
        if (!capturada) return;
        const byteString = atob(capturada.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ab], { type: 'image/jpeg' });
        const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
        detenerCamara();
        onCaptura(file);
    };

    const handleCerrar = () => {
        detenerCamara();
        onCerrar();
    };

    return (
        <div className="camara-overlay">
            <div className="camara-modal">
                <h3>Capturar foto</h3>

                {error && <p className="camara-error">{error}</p>}

                {!capturada ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="camara-video"
                        />
                        <div className="camara-acciones">
                            <button onClick={tomarFoto} disabled={!listo} className="btn-tomar">
                                Tomar foto
                            </button>
                            <button onClick={handleCerrar} className="btn-cancelar-camara">
                                Cancelar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={capturada} alt="Vista previa" className="camara-preview" />
                        <div className="camara-acciones">
                            <button onClick={confirmar} className="btn-confirmar">
                                Usar esta foto
                            </button>
                            <button onClick={repetir} className="btn-cancelar-camara">
                                Repetir
                            </button>
                        </div>
                    </>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </div>
    );
}
