export interface PatientData {
  nombre: string;
  dni: string;
  edad: number | string;
  medicoDerivante: string;
  motivoConsulta: string;
  antecedentesMedicos: string;
  medicacionActual: string;
  actividadFisica: string;
  sintomasReportados: string;
  observacionesTecnico: string;
  estado: 'Entrevista cargada' | 'Prueba realizada' | 'Informe enviado a cardióloga';
  notas: string;
}
