import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarInfoComponent } from './star-info.component';

describe('StarInfoComponent', () => {
  let component: StarInfoComponent;
  let fixture: ComponentFixture<StarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
