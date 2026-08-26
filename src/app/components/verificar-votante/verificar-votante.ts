import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VotacionService } from '../../services/votacion.service';
import { Aprendiz, Jornada } from '../../models/votacion.model';

@Component({
  selector: 'app-verificar-votante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verificar-votante.html',
  styleUrl: './verificar-votante.css'
})
export class VerificarVotanteComponent {
  cedula = '';
  aprendiz: Aprendiz | null = null;
  buscando = false;
  cargandoVoto = false;
  errorMsg = '';
  noEncontrado = false;

  private busquedaCedula = new Subject<string>();

  constructor(
    private votacionService: VotacionService,
    private router: Router
  ) {
    this.busquedaCedula.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(cedula => this.ejecutarBusqueda(cedula));
  }

  onCedulaChange() {
    this.aprendiz = null;
    this.errorMsg = '';
    this.noEncontrado = false;
    if (this.cedula.trim().length >= 4) {
      this.busquedaCedula.next(this.cedula.trim());
    }
  }

  ejecutarBusqueda(cedula: string) {
    this.buscando = true;
    this.votacionService.buscarAprendiz(cedula).subscribe({
      next: (data) => { this.aprendiz = data; this.buscando = false; },
      error: () => { this.aprendiz = null; this.noEncontrado = true; this.buscando = false; }
    });
  }

  obtenerIniciales(nombre: string): string {
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  formatearJornada(j: Jornada): string {
    const mapa: Record<Jornada, string> = { MANANA: 'Mañana', TARDE: 'Tarde', NOCHE: 'Noche' };
    return mapa[j];
  }

  continuar() {
    if (!this.aprendiz) return;
    this.cargandoVoto = true;
    this.errorMsg = '';

    this.votacionService.verificarVotante(this.cedula.trim()).subscribe({
      next: (respuesta) => {
        this.cargandoVoto = false;
        if (respuesta.yaVoto) {
          this.errorMsg = 'Esta cédula ya registró su voto. No puedes votar de nuevo.';
          return;
        }
        localStorage.setItem('votanteId', respuesta.votanteId.toString());
        localStorage.setItem('jornada', respuesta.jornada);
        this.router.navigate(['/votar']);
      },
      error: (err) => {
        this.cargandoVoto = false;
        this.errorMsg = err.error?.error || 'Ocurrió un error. Intenta de nuevo.';
      }
    });
  }
}