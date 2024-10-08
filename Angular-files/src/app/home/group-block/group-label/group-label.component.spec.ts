import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLabelComponent } from './group-label.component';

describe('GroupLabelComponent', () => {
  let component: GroupLabelComponent;
  let fixture: ComponentFixture<GroupLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupLabelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
