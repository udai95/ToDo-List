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
  toDoListData = computed(() => this.toDoService.filteredList());
  deepTitleSearch = signal<string>('');
  deepSearchListItem = signal<ToDoModel[]>([]);

  ngOnInit() {
    this.getTableCols();
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
    this.toDoService.updateFilterCriteria(criteria); // Update filter criteria in the service
  }

  deepSearch() {
    const searchTerm = this.deepTitleSearch();
    const allItems = this.toDoService.toDoList();

    const matchingItems = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const resultSet = new Set<ToDoModel>();
    const findDependencies = (item: ToDoModel) => {
      resultSet.add(item);

      if (item.dependsOn) {
        item.dependsOn.forEach((dependencyId) => {
          const dependentItem = allItems.find((i) => i.id === dependencyId);
          if (dependentItem && !resultSet.has(dependentItem)) {
            findDependencies(dependentItem);
          }
        });
      }
    };

    const findReverseDependencies = (item: ToDoModel) => {
      allItems.forEach((i) => {
        if (i.dependsOn?.includes(item.id) && !resultSet.has(i)) {
          resultSet.add(i);
          findReverseDependencies(i);
        }
      });
    };

    matchingItems.forEach((item) => {
      findDependencies(item);
      findReverseDependencies(item);
    });

    this.deepSearchListItem.set(Array.from(resultSet));
  }
}
