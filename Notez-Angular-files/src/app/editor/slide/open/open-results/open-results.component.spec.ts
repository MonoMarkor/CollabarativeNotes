import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenResultsComponent } from './open-results.component';

describe('OpenResultsComponent', () => {
  let component: OpenResultsComponent;
  let fixture: ComponentFixture<OpenResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
