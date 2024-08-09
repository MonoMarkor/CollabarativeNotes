import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBlockComponent } from './personal-block.component';

describe('PersonalBlockComponent', () => {
  let component: PersonalBlockComponent;
  let fixture: ComponentFixture<PersonalBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
