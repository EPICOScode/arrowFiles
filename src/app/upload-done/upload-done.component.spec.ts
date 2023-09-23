import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDoneComponent } from './upload-done.component';

describe('UploadDoneComponent', () => {
  let component: UploadDoneComponent;
  let fixture: ComponentFixture<UploadDoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadDoneComponent]
    });
    fixture = TestBed.createComponent(UploadDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
