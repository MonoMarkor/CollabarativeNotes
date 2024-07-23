import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFilesComponent } from './group-files.component';

describe('GroupFilesComponent', () => {
  let component: GroupFilesComponent;
  let fixture: ComponentFixture<GroupFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
