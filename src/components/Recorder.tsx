import { useState, useRef, useEffect } from 'react';

interface Props {
  onDone: (transcript: string) => void;
}

type RecordingState = 'idle' | 'recording' | 'stopped';

export default function Recorder({ onDone }: Props) {
  const [state, setState] = useState<RecordingState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [liveText, setLiveText] = useState('');
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const accumulatedRef = useRef('');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }

  function startRecording() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    accumulatedRef.current = '';
    setLiveText('');
    setSeconds(0);
    setState('recording');
    const recognition = new SR();
    recognition.lang = 'es-AR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          accumulatedRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      setLiveText(accumulatedRef.current + interim);
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        try { recognition.start(); } catch { }
      }
    };
    recognition.start();
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stopRecording() {
    setState('stopped');
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }

  if (!supported) {
    return (
      <div className="screen">
        <div className="screen-icon">⚠️</div>
        <h2>Reconocimiento de voz no disponible</h2>
        <p className="screen-desc">Usá Chrome en Android o pegá la transcripción manualmente.</p>
        <button className="btn btn-primary" onClick={() => onDone('')}>
          Ingresar transcripción manualmente
        </button>
      </div>
    );
  }

  return (
    <div className="screen recorder-screen">
      {state === 'idle' && (
        <>
          <div className="screen-icon pulse-ready">🎙️</div>
          <h2>Grabar entrevista</h2>
          <p className="screen-desc">Presioná el botón y hablá en español.</p>
          <button className="btn btn-record" onClick={startRecording}>● Iniciar grabación</button>
        </>
      )}
      {state === 'recording' && (
        <>
          <div className="recording-indicator">
            <div className="rec-dot" />
            <span className="rec-label">GRABANDO</span>
            <span className="rec-timer">{formatTime(seconds)}</span>
          </div>
          <div className="live-transcript">
            {liveText || <span className="placeholder">Empezá a hablar...</span>}
          </div>
          <button className="btn btn-stop" onClick={stopRecording}>■ Detener grabación</button>
        </>
      )}
      {state === 'stopped' && (
        <>
          <div className="screen-icon">✅</div>
          <h2>Grabación finalizada</h2>
          <p className="screen-desc">{formatTime(seconds)} grabados</p>
          <div className="live-transcript preview">
            {accumulatedRef.current.trim() || <span className="placeholder">No se detectó texto.</span>}
          </div>
          <div className="btn-group">
            <button className="btn btn-secondary" onClick={() => { accumulatedRef.current = ''; setLiveText(''); setSeconds(0); setState('idle'); }}>↩ Grabar de nuevo</button>
            <button className="btn btn-primary" onClick={() => onDone(accumulatedRef.current.trim())} disabled={!accumulatedRef.current.trim()}>Revisar →</button>
          </div>
        </>
      )}
    </div>
  );
}
