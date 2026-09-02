import React from 'react';

interface Props {
  transcript: string;
  onChange: (text: string) => void;
  onProcess: (text: string) => void;
  onBack: () => void;
  error: string;
}

export default function TranscriptEditor({ transcript, onChange, onProcess, onBack, error }: Props) {
  return (
    <div className="screen transcript-screen">
      <h2>Transcripción</h2>
      <p className="screen-desc">
        Revisá y corregí el texto antes de procesar.
      </p>
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}
      <textarea
        className="transcript-area"
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="La transcripción aparece acá. También podés escribir o pegar el texto manualmente."
        rows={12}
        spellCheck
        lang="es"
      />
      <p className="char-count">{transcript.length} caracteres</p>
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={onBack}>
          ↩ Volver a grabar
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onProcess(transcript)}
          disabled={transcript.trim().length < 20}
        >
          Procesar con IA →
        </button>
      </div>
    </div>
  );
}
