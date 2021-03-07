import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStarsComponent } from './edit-stars.component';

describe('EditStarsComponent', () => {
  let component: EditStarsComponent;
  let fixture: ComponentFixture<EditStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
