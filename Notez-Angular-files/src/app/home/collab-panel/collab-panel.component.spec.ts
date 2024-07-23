import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabPanelComponent } from './collab-panel.component';

describe('CollabPanelComponent', () => {
  let component: CollabPanelComponent;
  let fixture: ComponentFixture<CollabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollabPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
