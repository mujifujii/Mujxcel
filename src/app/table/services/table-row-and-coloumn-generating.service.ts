import { Injectable } from '@angular/core';
import {ITableRow} from '../../test/interfaces/ITableRow';

@Injectable({
  providedIn: 'root'
})

export class TableRowAndColoumnGeneratingService {
  generateRows(rowCount: number, cellCount: number, existingRows: ITableRow[] = []): ITableRow[] {
    const nextRowId = existingRows.length > 0 ? existingRows[existingRows.length - 1].id + 1 : 1;
    return Array.from({ length: rowCount }, (_, rowIndex) => ({
      id: nextRowId + rowIndex,
      cells: Array.from({ length: cellCount }, (_, cellIndex) => ({
        id: cellIndex + 1,
        value: '',
        isSelected: false,
      })),
      isSelected: false,
    }));
  }

  addRowBelow(rowIndex: number, rows: ITableRow[], headers: number[]): ITableRow[] {
    const newRow: ITableRow = {
      id: rows[rowIndex].id + 1,
      cells: headers.map((_, index) => ({
        id: index + 1,
        value: '',
        isSelected: false,
      })),
      isSelected: false,
    };

    const updatedRows = [...rows];
    updatedRows.splice(rowIndex + 1, 0, newRow);
    updatedRows.forEach((row, index) => (row.id = index + 1)); // Update row IDs
    return updatedRows;
  }

  addHeaderColumnNextTo(headerIndex: number, headers: number[], rows: ITableRow[]): { headers: number[]; rows: ITableRow[] } {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(headerIndex + 1, 0, headerIndex + 1);
    updatedHeaders.forEach((_, index) => (updatedHeaders[index] = index + 1));

    const updatedRows = rows.map(row => ({
      ...row,
      cells: [
        ...row.cells.slice(0, headerIndex + 1),
        { id: headerIndex + 1, value: '', isSelected: false },
        ...row.cells.slice(headerIndex + 1).map((cell, i) => ({ ...cell, id: headerIndex + 2 + i })),
      ],
    }));

    return { headers: updatedHeaders, rows: updatedRows };
  }

  constructor() { }
}
