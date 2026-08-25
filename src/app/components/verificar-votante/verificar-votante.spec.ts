import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarVotante } from './verificar-votante';

describe('VerificarVotante', () => {
  let component: VerificarVotante;
  let fixture: ComponentFixture<VerificarVotante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarVotante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarVotante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
