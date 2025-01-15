import { computed, Injectable, signal } from '@angular/core';
import { ToDoModel } from '../models/to-do-model';

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  itemsList = signal<ToDoModel[]>(this.getItemsFromLocalStorage());
  toDoList = computed(() => this.itemsList());
  showAddNewItemForm = signal<boolean>(false);
  editMode = signal<boolean>(false);
  editedItem = signal<ToDoModel | null>(null);
  filterCriteria = signal<any>({ title: '', startDate: '', endDate: '', category: '' });
  filteredList = computed(() => {
    const { title, startDate, endDate, category } = this.filterCriteria();
    const allItems = this.itemsList();

    return allItems.filter((item) => {
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
  });

  addItem(item: ToDoModel) {
    const nextId =
      this.itemsList().length > 0
        ? Math.max(...this.itemsList().map((i) => parseInt(i.id, 10))) + 1
        : 1;
    const newItem = { ...item, id: nextId.toString() };
    const updatedList = [...this.itemsList(), newItem];
    this.itemsList.set(updatedList);
    this.updateLocalStorage();
  }

  removeItem(id: string) {
    const itemToRemove = this.itemsList().find((item) => item.id === id);
    if (!itemToRemove) return;
    if (this.checkDependencies(itemToRemove)) return;

    const updatedList = this.itemsList().filter((item) => item.id !== id);
    this.itemsList.set(updatedList);
    this.updateLocalStorage();
  }

  checkDependencies(item: ToDoModel): boolean {
    return this.itemsList().some((i) => i.dependsOn?.includes(item.id));
  }

  updateItem(updatedItem: ToDoModel) {
    const updatedList = this.itemsList().map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.itemsList.set(updatedList);
    this.updateLocalStorage();
  }
  

  updateLocalStorage() {
    localStorage.setItem('items', JSON.stringify(this.itemsList()));
  }

  updateFilterCriteria(criteria: any) {
    this.filterCriteria.set(criteria);
  }

  private getItemsFromLocalStorage(): ToDoModel[] {
    const storedItems = localStorage.getItem('items');
    return storedItems ? JSON.parse(storedItems) : [];
  }
}
