import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PleavesComponent } from './pleaves.component';

describe('LeavesComponent', () => {
  let component: PleavesComponent;
  let fixture: ComponentFixture<PleavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PleavesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
