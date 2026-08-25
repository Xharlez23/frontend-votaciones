import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gracias',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RouterModule],
  templateUrl: './gracias.html',
  styleUrl: './gracias.css'
})
export class GraciasComponent implements OnInit {
  ngOnInit() {
    localStorage.removeItem('votanteId');
    localStorage.removeItem('jornada');
  }
}