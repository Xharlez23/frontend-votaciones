import { Routes } from '@angular/router';
import { VerificarVotanteComponent } from './components/verificar-votante/verificar-votante';
import { VotarComponent } from './components/votar/votar';
import { GraciasComponent } from './components/gracias/gracias';
import { ResultadosComponent } from './components/resultados/resultados';

export const routes: Routes = [
  { path: '', component: VerificarVotanteComponent },
  { path: 'votar', component: VotarComponent },
  { path: 'gracias', component: GraciasComponent },
  { path: 'resultados', component: ResultadosComponent },
  { path: '**', redirectTo: '' }
];