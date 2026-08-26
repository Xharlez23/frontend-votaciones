import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { VotacionService } from '../../services/votacion.service';
import { Jornada, ResultadosJornada } from '../../models/votacion.model';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class ResultadosComponent implements OnInit, OnDestroy {
  jornadas: Jornada[] = ['MANANA', 'TARDE', 'NOCHE'];
  jornadaSeleccionada: Jornada = 'MANANA';
  resultados: ResultadosJornada | null = null;
  cargando = true;
  errorMsg = '';
  private subscripcion?: Subscription;

  constructor(private votacionService: VotacionService, private route: ActivatedRoute) {}

  ngOnInit() {
    const jornadaParam = this.route.snapshot.queryParamMap.get('jornada') as Jornada | null;
    if (jornadaParam) this.jornadaSeleccionada = jornadaParam;
    this.iniciarActualizacionAutomatica();
  }

  iniciarActualizacionAutomatica() {
    this.subscripcion = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.votacionService.obtenerResultados(this.jornadaSeleccionada))
    ).subscribe({
      next: (data) => { this.resultados = data; this.cargando = false; this.errorMsg = ''; },
      error: () => { this.errorMsg = 'No se pudieron cargar los resultados.'; this.cargando = false; }
    });
  }

  cambiarJornada(jornada: Jornada) {
    this.jornadaSeleccionada = jornada;
    this.cargando = true;
    this.subscripcion?.unsubscribe();
    this.iniciarActualizacionAutomatica();
  }

  formatearJornada(j: Jornada): string {
    const mapa: Record<Jornada, string> = { MANANA: 'Mañana', TARDE: 'Tarde', NOCHE: 'Noche' };
    return mapa[j];
  }

  obtenerIniciales(nombre: string): string {
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  calcularPorcentaje(votos: number): number {
    if (!this.resultados || this.resultados.totalVotos === 0) return 0;
    return Math.round((votos / this.resultados.totalVotos) * 100);
  }

  ngOnDestroy() { this.subscripcion?.unsubscribe(); }
}