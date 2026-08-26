import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Candidato,
  Jornada,
  VotanteRespuesta,
  ResultadosJornada
} from '../models/votacion.model';
import { Aprendiz } from '../models/votacion.model';
@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  obtenerCandidatos(jornada: Jornada): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(`${this.apiUrl}/candidatos/${jornada}`);
  }

  buscarAprendiz(cedula: string): Observable<Aprendiz> {
    return this.http.get<Aprendiz>(`${this.apiUrl}/aprendiz/${cedula}`);
  }

  verificarVotante(cedula: string): Observable<VotanteRespuesta> {
    return this.http.post<VotanteRespuesta>(`${this.apiUrl}/votante/verificar`, { cedula });
  }

  emitirVoto(votanteId: number, candidatoId: number, jornada: Jornada): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/votar`, {
      votanteId,
      candidatoId,
      jornada
    });
  }

  obtenerResultados(jornada: Jornada): Observable<ResultadosJornada> {
    return this.http.get<ResultadosJornada>(`${this.apiUrl}/resultados/${jornada}`);
  }
}