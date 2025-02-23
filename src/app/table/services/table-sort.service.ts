import { Injectable } from '@angular/core';
import {ITableRow} from '../../test/interfaces/ITableRow';




@Injectable({
  providedIn: 'root'
})
export class TableSortService {
  sortRow(row: ITableRow): ITableRow {
    const sortedCells = [...row.cells].sort((a, b) => {
      const numA = Number(a.value);
      const numB = Number(b.value);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return (a.value || '').localeCompare(b.value || '');
    });

    sortedCells.forEach((cell, index) => (cell.id = index + 1));
    return { ...row, cells: sortedCells };
  }

  sortHeaderColumn(columnIndex: number, rows: ITableRow[]): ITableRow[] {
    const columnValues = rows.map((row, rowIndex) => ({
      value: row.cells[columnIndex]?.value || '',
      rowIndex,
    }));


    columnValues.sort((a, b) => {
      const numA = Number(a.value);
      const numB = Number(b.value);


      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.value.localeCompare(b.value);
    });

    const sortedRows = rows.map((row, index) => {
      const sortedCellValue = columnValues[index].value;
      const newRow = { ...row, cells: [...row.cells] };
      newRow.cells[columnIndex].value = sortedCellValue;
      return newRow;
    });

    return sortedRows;
  }
  constructor() { }
}
