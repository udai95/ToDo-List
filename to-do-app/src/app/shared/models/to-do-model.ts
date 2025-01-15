export interface ToDoModel {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  dependsOn?: string[];
}
