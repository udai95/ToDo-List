import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ToDoService } from '../../services/to-do.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-dynamic-search',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  templateUrl: './dynamic-search.component.html',
  styleUrl: './dynamic-search.component.scss',
})
export class DynamicSearchComponent {
  public toDoService = inject(ToDoService);
  private fb = inject(FormBuilder);

  @Output() search = new EventEmitter<any>();

  SearchForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.SearchForm = this.fb.group({
      title: [''],
      startDate: [''],
      endDate: [''],
      category: [''],
    });
  }

  onSearch() {
    this.search.emit(this.SearchForm.value);
  }
}
