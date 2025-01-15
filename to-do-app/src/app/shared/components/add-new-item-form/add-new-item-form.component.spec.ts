import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemFormComponent } from './add-new-item-form.component';

describe('AddNewItemFormComponent', () => {
  let component: AddNewItemFormComponent;
  let fixture: ComponentFixture<AddNewItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewItemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
