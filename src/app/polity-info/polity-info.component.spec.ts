import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolityInfoComponent } from './polity-info.component';

describe('PolityInfoComponent', () => {
  let component: PolityInfoComponent;
  let fixture: ComponentFixture<PolityInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolityInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
