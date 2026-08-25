export type Jornada = 'MANANA' | 'TARDE' | 'NOCHE';

export interface Candidato {
  id: number;
  nombre: string;
  ficha: string;
  jornada: Jornada;
  foto_url?: string;
}

export interface VotanteRespuesta {
  votanteId: number;
  yaVoto: boolean;
  jornada: Jornada;
  mensaje: string;
}

export interface ResultadoCandidato {
  id: number;
  nombre: string;
  ficha: string;
  votos: number;
}

export interface ResultadosJornada {
  jornada: Jornada;
  totalVotos: number;
  resultados: ResultadoCandidato[];
}