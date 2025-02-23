import { Injectable } from '@angular/core';
import {ITableRow} from '../../test/interfaces/ITableRow';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  deleteTableRow(rowIndex: number, rows: ITableRow[]): ITableRow[] {
    const updatedRows = [...rows];
    if (updatedRows[rowIndex].isSelected) {
      updatedRows[rowIndex + 1].isSelected = true;
    }
    updatedRows.splice(rowIndex, 1);
    updatedRows.forEach((row, index) => (row.id = index + 1));
    return updatedRows;
  }

  deleteHeaderColumn(headerIndex: number, headers: number[], rows: ITableRow[]): { headers: number[]; rows: ITableRow[] } {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(headerIndex, 1);
    updatedHeaders.forEach((_, index) => (updatedHeaders[index] = index + 1));
    const updatedRows = rows.map(row => ({
      ...row,
      cells: [
        ...row.cells.slice(0, headerIndex),
        ...row.cells.slice(headerIndex + 1).map((cell, i) => ({ ...cell, id: i + 1 })),
      ],
    }));
    return { headers: updatedHeaders, rows: updatedRows };
  }
  constructor() { }
}
