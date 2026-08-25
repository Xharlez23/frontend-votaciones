import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { VotacionService } from '../../services/votacion.service';
import { Jornada, ResultadosJornada } from '../../models/votacion.model';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonToggleModule, MatProgressSpinnerModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class ResultadosComponent implements OnInit, OnDestroy {
  jornadaSeleccionada: Jornada = 'MANANA';
  resultados: ResultadosJornada | null = null;
  cargando = true;
  errorMsg = '';
  private subscripcion?: Subscription;

  constructor(
    private votacionService: VotacionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Si viene una jornada por query param, la usamos (ej: /resultados?jornada=TARDE)
    const jornadaParam = this.route.snapshot.queryParamMap.get('jornada') as Jornada | null;
    if (jornadaParam) {
      this.jornadaSeleccionada = jornadaParam;
    }

    this.iniciarActualizacionAutomatica();
  }

  iniciarActualizacionAutomatica() {
    // Se actualiza inmediatamente y luego cada 5 segundos, para que se vea "en vivo"
    this.subscripcion = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.votacionService.obtenerResultados(this.jornadaSeleccionada))
    ).subscribe({
      next: (data) => {
        this.resultados = data;
        this.cargando = false;
        this.errorMsg = '';
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los resultados.';
        this.cargando = false;
      }
    });
  }

  cambiarJornada(jornada: Jornada) {
    this.jornadaSeleccionada = jornada;
    this.cargando = true;
    this.subscripcion?.unsubscribe();
    this.iniciarActualizacionAutomatica();
  }

  calcularPorcentaje(votos: number): number {
    if (!this.resultados || this.resultados.totalVotos === 0) return 0;
    return Math.round((votos / this.resultados.totalVotos) * 100);
  }

  ngOnDestroy() {
    this.subscripcion?.unsubscribe();
  }
}