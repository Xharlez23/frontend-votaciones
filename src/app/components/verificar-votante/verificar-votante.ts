import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { VotacionService } from '../../services/votacion.service';
import { Jornada } from '../../models/votacion.model';

@Component({
  selector: 'app-verificar-votante',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './verificar-votante.html',
  styleUrl: './verificar-votante.css'
})
export class VerificarVotanteComponent {
  cedula = '';
  nombre = '';
  jornada: Jornada | '' = '';
  cargando = false;
  errorMsg = '';

  constructor(
    private votacionService: VotacionService,
    private router: Router
  ) {}

  verificar() {
    this.errorMsg = '';

    if (!this.cedula || !this.nombre || !this.jornada) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;

    this.votacionService.verificarVotante(this.cedula, this.nombre, this.jornada).subscribe({
      next: (respuesta) => {
        this.cargando = false;

        if (respuesta.yaVoto) {
          this.errorMsg = 'Esta cédula ya registró su voto. No puedes votar de nuevo.';
          return;
        }

        // Guardamos los datos del votante para la siguiente pantalla
        localStorage.setItem('votanteId', respuesta.votanteId.toString());
        localStorage.setItem('jornada', respuesta.jornada);

        this.router.navigate(['/votar']);
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.error || 'Ocurrió un error al verificar. Intenta de nuevo.';
      }
    });
  }
}