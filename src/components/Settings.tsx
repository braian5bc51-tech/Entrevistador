import React, { useState } from 'react';

interface Props {
  initialApiKey: string;
  initialDate: string;
  onSave: (apiKey: string, date: string) => void;
}

export default function Settings({ initialApiKey, initialDate, onSave }: Props) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [date, setDate] = useState(initialDate);
  const [showKey, setShowKey] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    onSave(apiKey.trim(), date);
  }

  function toInputDate(d: string): string {
    const [dd, mm, yyyy] = d.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  function fromInputDate(d: string): string {
    const [yyyy, mm, dd] = d.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  return (
    <div className="screen settings-screen">
      <div className="screen-icon">⚙️</div>
      <h2>Configuración</h2>
      <p className="screen-desc">
        Ingresá tu clave de API de Claude y la fecha del estudio para continuar.
      </p>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="field">
          <label htmlFor="api-key">Clave de API (Claude)</label>
          <div className="input-row">
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" className="toggle-btn" onClick={() => setShowKey(!showKey)}>
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <span className="field-hint">
            Obtenéla en console.anthropic.com. Se guarda solo en este dispositivo.
          </span>
        </div>
        <div className="field">
          <label htmlFor="study-date">Fecha del estudio</label>
          <input
            id="study-date"
            type="date"
            value={toInputDate(date)}
            onChange={(e) => setDate(fromInputDate(e.target.value))}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!apiKey.trim()}>
          Guardar y continuar →
        </button>
      </form>
    </div>
  );
}
