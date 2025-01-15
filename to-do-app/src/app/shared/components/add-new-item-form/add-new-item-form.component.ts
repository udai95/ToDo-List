import { InputTextModule } from 'primeng/inputtext';
import { Component, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToDoService } from '../../services/to-do.service';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-add-new-item-form',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    MultiSelectModule,
  ],
  templateUrl: './add-new-item-form.component.html',
  styleUrl: './add-new-item-form.component.scss',
})
export class AddNewItemFormComponent {
  public toDoService = inject(ToDoService);
  private fb = inject(FormBuilder);

  itemForm!: FormGroup;

  dropdownItems = computed(() => this.toDoService.toDoList() || []);
  title = signal<string>('Add New Item');

  ngOnInit() {
    this.initForm();
    if (this.toDoService.editMode() && this.toDoService.editedItem()) {
      this.title.set('Edit ' + this.toDoService.editedItem()?.title);
      this.itemForm.patchValue(this.toDoService.editedItem()!);
    }
  }

  initForm() {
    this.itemForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      category: ['', Validators.required],
      dependsOn: [''],
    });
  }

  addItem() {
    if (this.itemForm.valid) {
      if (this.toDoService.editMode())
        this.toDoService.updateItem(this.itemForm.value);
      else this.toDoService.addItem(this.itemForm.value);
      this.onClose();
    }
  }

  onClose() {
    this.toDoService.showAddNewItemForm.set(false);
    this.itemForm.reset();
  }
}
