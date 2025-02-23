import { Injectable } from '@angular/core';
import {ITableRow} from '../../test/interfaces/ITableRow';


@Injectable({
  providedIn: 'root'
})
export class TableMathService {

  addCellValues(rowIndex: number, rows: ITableRow[]): ITableRow[] {
    const row = rows[rowIndex - 1];
    const sum = row.cells.reduce((acc, cell) => acc + (Number(cell.value) || 0), 0);
    row.cells[row.cells.length - 1].value = sum.toString();
    return rows;
  }

  addColumnValues(columnIndex: number, rows: ITableRow[]): ITableRow[] {
    const sum = rows.reduce((acc, row) => acc + (Number(row.cells[columnIndex]?.value) || 0), 0);
    rows[rows.length - 1].cells[columnIndex].value = sum.toString();
    return rows;
  }

  addCellValuesForAllRows(rows: ITableRow[]): ITableRow[] {
    return rows.map(row => {
      const sum = row.cells.reduce((acc, cell) => acc + (Number(cell.value) || 0), 0);
      row.cells[row.cells.length - 1].value = sum.toString();
      return row;
    });
  }
  constructor() { }
}
