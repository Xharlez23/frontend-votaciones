import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gracias',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './gracias.html',
  styleUrl: './gracias.css'
})
export class GraciasComponent implements OnInit, OnDestroy {
  segundosRestantes = 15;
  private intervalo?: ReturnType<typeof setInterval>;

  constructor(private router: Router) {}

  ngOnInit() {
    localStorage.removeItem('votanteId');
    localStorage.removeItem('jornada');

    this.intervalo = setInterval(() => {
      this.segundosRestantes--;
      if (this.segundosRestantes <= 0) this.router.navigate(['/']);
    }, 1000);
  }

  ngOnDestroy() { if (this.intervalo) clearInterval(this.intervalo); }
}