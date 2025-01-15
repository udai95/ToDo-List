import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToDoService } from '../../shared/services/to-do.service';
import { IHeaderTable } from '../../shared/models/iheader-table';
import { AddNewItemFormComponent } from '../../shared/components/add-new-item-form/add-new-item-form.component';
import { DynamicSearchComponent } from '../../shared/components/dynamic-search/dynamic-search.component';
import { ToDoModel } from '../../shared/models/to-do-model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TableComponent,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    AddNewItemFormComponent,
    DynamicSearchComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  public toDoService = inject(ToDoService);

  title = 'To Do App';
  toDoListCols!: IHeaderTable[];
  filteredToDoListData = signal<ToDoModel[]>([]); 
  toDoListData = computed(() => this.filteredToDoListData());

  ngOnInit() {
    this.getTableCols();
    this.initializeData();
  }

  private getTableCols() {
    this.toDoListCols = [
      { header: 'ID', field: 'id' },
      { header: 'Title', field: 'title' },
      { header: 'Start Date', field: 'startDate' },
      { header: 'End Date', field: 'endDate' },
      { header: 'Category', field: 'category' },
      { header: 'Depends On', field: 'dependsOn' },
    ];
  }

  private initializeData() {
    this.filteredToDoListData.set(this.toDoService.toDoList());
  }

  editItem(item: any) {
    console.log(item);
    this.toDoService.editedItem.set(item);
    this.toDoService.editMode.set(item);
    this.toDoService.showAddNewItemForm.set(true);
  }

  deleteItem(item: any) {
    this.toDoService.removeItem(item.id);
  }

  filterToDoList(criteria: any) {
    const { title, startDate, endDate, category } = criteria;

    const filtered = this.toDoService.toDoList().filter((item) => {
      const matchesTitle = title ? item.title.includes(title) : true;
      const matchesCategory = category ? item.category.includes(category) : true;
      const matchesStartDate = startDate
        ? new Date(item.startDate) >= new Date(startDate)
        : true;
      const matchesEndDate = endDate
        ? new Date(item.endDate) <= new Date(endDate)
        : true;

      return matchesTitle && matchesCategory && matchesStartDate && matchesEndDate;
    });

    this.filteredToDoListData.set(filtered);
  }
}

