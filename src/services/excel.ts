import * as XLSX from 'xlsx';
import { PatientData } from '../types';

const HEADERS = [
  'Fecha del estudio','Nombre del paciente','DNI','Edad','Médico derivante',
  'Motivo de consulta','Antecedentes médicos','Medicación actual',
  'Actividad física / Estilo de vida','Síntomas reportados',
  'Observaciones del técnico','Estado','Notas',
];

export function generateExcel(patients: PatientData[], date: string): void {
  const wb = XLSX.utils.book_new();
  const wsData = [
    HEADERS,
    ...patients.map(p => [
      date, p.nombre, p.dni, p.edad, p.medicoDerivante,
      p.motivoConsulta, p.antecedentesMedicos, p.medicacionActual,
      p.actividadFisica, p.sintomasReportados, p.observacionesTecnico,
      p.estado, p.notas,
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [14,24,16,8,22,26,36,28,32,34,34,18,22].map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, 'Registro Pacientes');
  XLSX.writeFile(wb, `${date.replace(/\//g, '-')}.xlsx`);
}
