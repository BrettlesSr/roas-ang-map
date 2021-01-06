import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPolityToHistoryComponent } from './add-polity-to-history.component';

describe('AddPolityToHistoryComponent', () => {
  let component: AddPolityToHistoryComponent;
  let fixture: ComponentFixture<AddPolityToHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPolityToHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPolityToHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
