export type Jornada = 'MANANA' | 'TARDE' | 'NOCHE';

export interface Candidato {
  id: number;
  nombre: string;
  ficha: string;
  jornada: Jornada;
  foto_url?: string;
}

export interface Aprendiz {
  id: number;
  cedula: string;
  nombre: string;
  ficha: string;
  programa: string;
  jornada: Jornada;
}

export interface VotanteRespuesta {
  votanteId: number;
  yaVoto: boolean;
  nombre: string;
  ficha: string;
  programa: string;
  jornada: Jornada;
  mensaje: string;
}

export interface ResultadoCandidato {
  id: number;
  nombre: string;
  ficha: string;
  foto_url?: string;
  votos: number;
}

export interface ResultadosJornada {
  jornada: Jornada;
  totalVotos: number;
  resultados: ResultadoCandidato[];
}
