import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBranchComponent } from './personalBranch.component';

describe('PersonalBranchComponent', () => {
  let component: PersonalBranchComponent;
  let fixture: ComponentFixture<PersonalBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalBranchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
