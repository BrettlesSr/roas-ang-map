import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPolityComponent } from './add-polity.component';

describe('AddPolityComponent', () => {
  let component: AddPolityComponent;
  let fixture: ComponentFixture<AddPolityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPolityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPolityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
