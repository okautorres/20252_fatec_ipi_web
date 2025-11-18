import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroProd } from './cadastroprod';

describe('Cadastroprod', () => {
  let component: CadastroProd;
  let fixture: ComponentFixture<CadastroProd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroProd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroProd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
