import React, { useState } from 'react';
import Settings from './components/Settings';
import Recorder from './components/Recorder';
import TranscriptEditor from './components/TranscriptEditor';
import ExcelExport from './components/ExcelExport';
import { extractPatientData } from './services/claude';
import { generateExcel } from './services/excel';
import { PatientData } from './types';
import './styles/App.css';

type Screen = 'settings' | 'recording' | 'transcript' | 'processing' | 'result';

function todayFormatted(): string {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('/');
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    localStorage.getItem('claude_api_key') ? 'recording' : 'settings'
  );
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('claude_api_key') || '');
  const [date, setDate] = useState(todayFormatted);
  const [transcript, setTranscript] = useState('');
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [error, setError] = useState('');

  const STEPS: Screen[] = ['settings', 'recording', 'transcript', 'processing', 'result'];
  const stepIndex = STEPS.indexOf(screen);

  function handleSettingsSave(key: string, d: string) {
    localStorage.setItem('claude_api_key', key);
    setApiKey(key);
    setDate(d);
    setScreen('recording');
  }

  function handleRecordingDone(text: string) {
    setTranscript(text);
    setScreen('transcript');
  }

  async function handleProcess(text: string) {
    setScreen('processing');
    setError('');
    try {
      const data = await extractPatientData(text, apiKey, date);
      setPatients(data);
      setScreen('result');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setScreen('transcript');
    }
  }

  function handleDownload() {
    generateExcel(patients, date);
  }

  function handleNew() {
    setTranscript('');
    setPatients([]);
    setError('');
    setScreen('recording');
  }

  function goToSettings() {
    setScreen('settings');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">VO₂MAX</span>
          <span className="header-sub">Entrevistas</span>
        </div>
        <button className="header-settings" onClick={goToSettings} aria-label="Ajustes">
          ⚙️
        </button>
      </header>

      {/* Progress bar */}
      {screen !== 'settings' && (
        <div className="progress-bar">
          {['Grabar', 'Revisar', 'Generar'].map((label, i) => (
            <div
              key={i}
              className={`progress-step ${
                i < stepIndex - 1 ? 'done' : i === stepIndex - 1 ? 'active' : ''
              }`}
            >
              <div className="progress-dot" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      <main className="app-main">
        {screen === 'settings' && (
          <Settings
            initialApiKey={apiKey}
            initialDate={date}
            onSave={handleSettingsSave}
          />
        )}

        {screen === 'recording' && (
          <Recorder onDone={handleRecordingDone} />
        )}

        {screen === 'transcript' && (
          <TranscriptEditor
            transcript={transcript}
            onChange={setTranscript}
            onProcess={handleProcess}
            onBack={() => setScreen('recording')}
            error={error}
          />
        )}

        {screen === 'processing' && (
          <div className="screen processing-screen">
            <div className="spinner" />
            <h2>Procesando...</h2>
            <p className="screen-desc">
              Claude está estructurando los datos del paciente.
              <br />
              Esto tarda unos segundos.
            </p>
          </div>
        )}

        {screen === 'result' && (
          <ExcelExport
            patients={patients}
            date={date}
            onDownload={handleDownload}
            onNew={handleNew}
          />
        )}
      </main>
    </div>
  );
}
