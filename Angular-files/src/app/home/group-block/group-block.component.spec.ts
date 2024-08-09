import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBlockComponent } from './group-block.component';

describe('GroupBlockComponent', () => {
  let component: GroupBlockComponent;
  let fixture: ComponentFixture<GroupBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
