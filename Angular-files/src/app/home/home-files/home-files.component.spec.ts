import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFilesComponent } from './home-files.component';

describe('HomeFilesComponent', () => {
  let component: HomeFilesComponent;
  let fixture: ComponentFixture<HomeFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
