import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDownloadComponent } from './layout-download.component';

describe('LayoutDownloadComponent', () => {
  let component: LayoutDownloadComponent;
  let fixture: ComponentFixture<LayoutDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
