import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VotacionService } from '../../services/votacion.service';
import { Candidato, Jornada } from '../../models/votacion.model';

@Component({
  selector: 'app-votar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './votar.html',
  styleUrl: './votar.css'
})
export class VotarComponent implements OnInit {
  candidatos: Candidato[] = [];
  votanteId: number | null = null;
  jornada: Jornada | null = null;
  cargando = true;
  enviandoVoto = false;
  errorMsg = '';
  candidatoSeleccionado: number | null = null;

  constructor(private votacionService: VotacionService, private router: Router) {}

  ngOnInit() {
    const votanteIdGuardado = localStorage.getItem('votanteId');
    const jornadaGuardada = localStorage.getItem('jornada') as Jornada | null;

    if (!votanteIdGuardado || !jornadaGuardada) {
      this.router.navigate(['/']);
      return;
    }

    this.votanteId = parseInt(votanteIdGuardado, 10);
    this.jornada = jornadaGuardada;
    this.cargarCandidatos();
  }

  cargarCandidatos() {
    if (!this.jornada) return;
    this.votacionService.obtenerCandidatos(this.jornada).subscribe({
      next: (data) => { this.candidatos = data; this.cargando = false; 
        console.log('Candidatos cargados:', data);
      },
      error: () => { this.errorMsg = 'No se pudieron cargar los candidatos.'; this.cargando = false; }
    });
  }

  seleccionar(candidatoId: number) { this.candidatoSeleccionado = candidatoId; }

  obtenerIniciales(nombre: string): string {
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  formatearJornada(j: Jornada | null): string {
    if (!j) return '';
    const mapa: Record<Jornada, string> = { MANANA: 'Mañana', TARDE: 'Tarde', NOCHE: 'Noche' };
    return mapa[j];
  }

  confirmarVoto() {
    if (!this.candidatoSeleccionado || !this.votanteId || !this.jornada) return;
    this.enviandoVoto = true;
    this.errorMsg = '';

    this.votacionService.emitirVoto(this.votanteId, this.candidatoSeleccionado, this.jornada).subscribe({
      next: () => { this.enviandoVoto = false; this.router.navigate(['/gracias']); },
      error: (err) => {
        this.enviandoVoto = false;
        this.errorMsg = err.error?.error || 'Ocurrió un error al votar. Intenta de nuevo.';
      }
    });
  }
}