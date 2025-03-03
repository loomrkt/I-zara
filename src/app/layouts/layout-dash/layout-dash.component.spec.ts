import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDashComponent } from './layout-dash.component';

describe('LayoutDashComponent', () => {
  let component: LayoutDashComponent;
  let fixture: ComponentFixture<LayoutDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
