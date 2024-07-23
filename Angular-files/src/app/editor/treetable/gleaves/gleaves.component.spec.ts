import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GleavesComponent } from './gleaves.component';

describe('GleavesComponent', () => {
  let component: GleavesComponent;
  let fixture: ComponentFixture<GleavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GleavesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
