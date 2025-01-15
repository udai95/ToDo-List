import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { IHeaderTable } from '../../models/iheader-table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule,FormsModule,CommonModule,NgTemplateOutlet,RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  public columns = input<IHeaderTable[]>([]);
  public data = input<any[]>([]);
  public tableMinWidth = input<string>('50rem');
  public tableBorderStyle = input<string>('1px solid #D2D6DB');
  public tableStyleClass = input<string>('');
  public scrollable = input<boolean>(false);
  public isContainActions = input<boolean>(false);
  public isLoading = input<boolean>();
  public scrollHeight = input<string>('');
  public actionTemplate = input<any>();
  public actionNameHeader = input<string>('');
  public actionIconHeader = input<string>('');
  public numberOfRows = input<number>(5);


  trackByField(index: number, column: any): string {
    return column.field;
  }

  getRowValueFromHeader(header: IHeaderTable, rowData: any) {
    return rowData[header.field];
  }
}