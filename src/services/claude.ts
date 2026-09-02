import { PatientData } from '../types';

const PROMPT = `Sos el asistente de carga de datos para el registro de pacientes de pruebas de esfuerzo (CPET) de VO2MAX. Extraé los datos de CADA paciente mencionado y devolvé SOLO un JSON válido sin texto adicional:

[
  {
    "nombre": "Apellido, Nombre",
    "dni": "XX.XXX.XXX",
    "edad": 00,
    "medicoDerivante": "Dr./Dra. Nombre",
    "motivoConsulta": "texto",
    "antecedentesMedicos": "texto",
    "medicacionActual": "texto",
    "actividadFisica": "texto",
    "sintomasReportados": "texto",
    "observacionesTecnico": "texto",
    "estado": "Entrevista cargada",
    "notas": "texto"
  }
]

REGLAS: Nunca abreviaturas médicas (hipertensión arterial nunca HTA, infarto agudo de miocardio nunca IAM, frecuencia cardíaca nunca FC). Si falta un dato usá "". Si falta nombre usá "(sin nombre registrado)". Estado "Prueba realizada" si describe lo que pasó durante el estudio. Devolvé SOLO el JSON.`;

export async function extractPatientData(
  transcript: string,
  apiKey: string,
  date: string
): Promise<PatientData[]> {
  if (!apiKey.trim()) throw new Error('Falta la clave de API de Claude.');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: PROMPT,
      messages: [{ role: 'user', content: `Fecha: ${date}\n\nTranscripción:\n\n${transcript}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Error de API: ${(err as any)?.error?.message || response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? '';
  const clean = text.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(clean);
    if (!Array.isArray(parsed)) throw new Error();
    return parsed as PatientData[];
  } catch {
    throw new Error('El modelo devolvió un formato inesperado. Revisá la transcripción.');
  }
}
