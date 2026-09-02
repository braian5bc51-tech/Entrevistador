import React from 'react';
import { PatientData } from '../types';

interface Props {
  patients: PatientData[];
  date: string;
  onDownload: () => void;
  onNew: () => void;
}

const ESTADO_COLOR: Record<string, string> = {
  'Prueba realizada': '#d9ead3',
  'Entrevista cargada': '#fce5cd',
  'Informe enviado a cardióloga': '#cfe2f3',
};

export default function ExcelExport({ patients, date, onDownload, onNew }: Props) {
  return (
    <div className="screen result-screen">
      <div className="screen-icon">✅</div>
      <h2>Listo para descargar</h2>
      <p className="screen-desc">
        {patients.length} paciente{patients.length !== 1 ? 's' : ''} procesado{patients.length !== 1 ? 's' : ''} — {date}
      </p>
      <div className="patient-list">
        {patients.map((p, i) => (
          <div key={i} className="patient-card">
            <div className="patient-card-header">
              <strong>{p.nombre || '(sin nombre)'}</strong>
              <span className="estado-badge" style={{ background: ESTADO_COLOR[p.estado] || '#eee' }}>
                {p.estado}
              </span>
            </div>
            <div className="patient-card-body">
              {p.dni && <span className="detail">DNI: {p.dni}</span>}
              {p.edad && <span className="detail">Edad: {p.edad}</span>}
              {p.medicoDerivante && <span className="detail">Derivante: {p.medicoDerivante}</span>}
              {p.motivoConsulta && <p className="motivo">{p.motivoConsulta}</p>}
              {p.notas && <p className="nota">⚠️ {p.notas}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="btn-group sticky-bottom">
        <button className="btn btn-secondary" onClick={onNew}>+ Nueva entrevista</button>
        <button className="btn btn-primary btn-download" onClick={onDownload}>⬇ Descargar Excel</button>
      </div>
    </div>
  );
                }
