import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFileFormComponent } from './add-file-form.component';

describe('AddFileFormComponent', () => {
  let component: AddFileFormComponent;
  let fixture: ComponentFixture<AddFileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFileFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
