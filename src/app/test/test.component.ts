import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {ExportExcelService} from '../services/export-excel.service';


interface TableCell {
  id: number;
  value: string;
  isSelected: boolean;
}

interface TableRow {
  id: number;
  cells: TableCell[];
  isSelected: boolean;
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})

export class TestComponent {

  @ViewChild('myTable') table!: ElementRef;


  TableHeaderArray: number[] = [];
  TableRowArray: TableRow[] = [];
  rowInput: number = 1;
  headerInput: number = 1;
  TableDataSavedInLocalstorage:TableRow[] = []
  SearchValue: string = '';





  constructor(private cdr: ChangeDetectorRef,
              private exportExcelService: ExportExcelService,) {
    this.initializeTable();

  }


  initializeTable() {
    this.TableHeaderArray = [1, 2, 3, 4, 5];
    this.TableRowArray = this.generateRows(5, this.TableHeaderArray.length);
  }

exportToExcel(){
    this.exportExcelService.exportTableToExcel('myTable', 'ExcelMujxcel')
}


  generateRows(rowCount: number, cellCount: number): TableRow[] {
    console.log("generateRows")
    const nextRowId = this.TableRowArray.length > 0 ? this.TableRowArray[this.TableRowArray.length - 1].id + 1 : 1;
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


  ToggleRowVisibility(rowIndex:number){

    this.TableRowArray[rowIndex].isSelected = !this.TableRowArray[rowIndex].isSelected
    console.log(rowIndex)
    console.log(this.TableRowArray[rowIndex].isSelected)

}



  addRowBelow(rowIndex: number) {
    const currentRowNumber = this.TableRowArray[rowIndex].id;
    const newRow: TableRow = {
      id: currentRowNumber + 1,
      cells: this.TableHeaderArray.map((_, index) => ({
        id: index + 1,
        value: '',
        isSelected: false,
      })),
      isSelected: false,
    };




    this.TableRowArray.splice(rowIndex + 1, 0, newRow);
    for (let i = rowIndex + 2; i < this.TableRowArray.length; i++) {
      this.TableRowArray[i].id += 1;
    }
  }

  SearchForValue(SearchValue: string) {

      for (let i = 0; i < this.TableRowArray.length; i++) {

        for (let j = 0; j < this.TableRowArray[i].cells.length; j++) {

          if (this.TableRowArray[i].cells[j].value === this.SearchValue){
            this.TableRowArray[i].cells[j].isSelected = true
            console.log(3 , this.TableRowArray[i].cells[j].isSelected);
          }
        }
      }
  }
  DeSelectCells(SearchValue: string){
    for (let i = 0; i < this.TableRowArray.length; i++) {

      for (let j = 0; j < this.TableRowArray[i].cells.length; j++) {
        if (SearchValue === ''){
          this.TableRowArray[i].cells[j].isSelected = false
        }

        if (this.TableRowArray[i].cells[j].value === this.SearchValue){
          this.TableRowArray[i].cells[j].isSelected = false
          console.log(3 , this.TableRowArray[i].cells[j].isSelected);
        }
      }
    }
  }


  SortRow(index: number) {
    const row = this.TableRowArray[index];

    if (!row || !row.cells) {
      console.error('Row or cells array is undefined.');
      return;
    }


    row.cells.sort((cellA, cellB) => {

      const numA = Number(cellA.value);
      const numB = Number(cellB.value);


      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }


      return (cellA.value || '').localeCompare(cellB.value || '');
    });


    row.cells.forEach((cell, cellIndex) => {
      cell.id = cellIndex + 1;
    });

    console.log('Sorted Row:', row);
  }


  SortHeaderColumn(Index: number) {
    if (!this.TableRowArray || this.TableRowArray.length === 0) {
      console.error('No arrays to sort.');
      return;
    }


    if (Index < 0 || Index >= this.TableRowArray[0].cells.length) {
      console.error('Invalid target index.');
      return;
    }

    // Extract the column values at the specified index
    const columnValues = this.TableRowArray.map((row) => ({
      value: Number(row.cells[Index]?.value || 0),
      row: row,
    }));


    columnValues.sort((a, b) => a.value - b.value);


    columnValues.forEach((sortedItem, sortedIndex) => {
      const rowToUpdate = this.TableRowArray[sortedIndex];
      rowToUpdate.cells[Index].value = sortedItem.value.toString();
    });

    console.log('Column sorted by index:', Index, this.TableRowArray);
  }




  addHeaderColumnNextTo(HeaderIndex: number) {
    console.log('Adding header column next to index', HeaderIndex);


    this.TableHeaderArray.splice(HeaderIndex + 1, 0, HeaderIndex + 1);


    for (let i = HeaderIndex + 1; i < this.TableHeaderArray.length; i++) {
      this.TableHeaderArray[i] = i + 1;
    }


    for (let row of this.TableRowArray) {
      row.cells.splice(HeaderIndex + 1, 0, {
        id: HeaderIndex + 1,
        value: '',
        isSelected: false,
      });


      for (let i = HeaderIndex + 1; i < row.cells.length; i++) {
        row.cells[i].id = i + 1;
      }
    }

    console.log('Updated table structure:', this.TableHeaderArray, this.TableRowArray);
  }
  deleteHeaderColumn(HeaderIndex: number) {

    this.TableHeaderArray.splice(HeaderIndex, 1);


    for (let row of this.TableRowArray) {

      row.cells.splice(HeaderIndex, 1);


      for (let i = HeaderIndex; i < row.cells.length; i++) {
        row.cells[i].id = i + 1;
      }
    }


    for (let i = HeaderIndex; i < this.TableHeaderArray.length; i++) {
      this.TableHeaderArray[i] = i + 1;
    }

    console.log('Spalte gelöscht. Aktualisierte Tabelle:', this.TableRowArray);
  }

  deleteTableRow(rowIndex: number) {

    this.TableRowArray.splice(rowIndex, 1);


    for (let i = rowIndex; i < this.TableRowArray.length; i++) {
      this.TableRowArray[i].id = i + 1;
    }

    console.log('Zeile gelöscht. Aktualisierte Tabelle:', this.TableRowArray);
  }





  test(){
    console.log(this.TableRowArray)
  }

  addRow() {
    console.log(1 , this.TableRowArray);
    const targetRowCount = this.rowInput;
    const currentRowCount = this.TableRowArray.length;

    if (targetRowCount > currentRowCount) {
      const rowsToAdd = targetRowCount - currentRowCount;
      const newRows = this.generateRows(rowsToAdd, this.TableHeaderArray.length);
      this.TableRowArray.push(...newRows);
    } else if (targetRowCount < currentRowCount) {
      this.TableRowArray.splice(targetRowCount, currentRowCount - targetRowCount);
    } else {
      console.log('The table already has the requested number of rows.');
    }
    console.log(2, this.TableRowArray);
  }


  addHeader() {
    this.TableHeaderArray = Array.from({ length: this.headerInput }, (_, i) => i + 1);
    this.TableRowArray.forEach((row) => {
      row.cells = this.TableHeaderArray.map((_, index) => ({
        id: index + 1,
        value: row.cells[index]?.value || '',
        isSelected: false,
      }));
    });
  }


  updateCellValue(rowId: number, cellId: number, event: Event) {
    const row = this.TableRowArray.find((r) => r.id === rowId);
    if (row) {
      const cell = row.cells.find((c) => c.id === cellId);
      if (cell) {
        cell.value = (event.target as HTMLElement).textContent || '';

      }
    }
  }


  logTableData() {
    this.TableDataSavedInLocalstorage = this.TableRowArray
    console.log('Table Data:', this.TableDataSavedInLocalstorage);
    localStorage.setItem('tableData', JSON.stringify(this.TableDataSavedInLocalstorage));
    console.log('Table Data:', JSON.stringify(this.TableDataSavedInLocalstorage));
  }

  fillTableData() {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);


        this.TableRowArray = parsedData.map((row: any, rowIndex: number) => ({
          id: row.id ?? rowIndex + 1,
          cells: row.cells.map((cell: any, cellIndex: number) => ({
            id: cell.id ?? cellIndex + 1,
            value: cell.value || '',
            isSelected: cell.isSelected,
          })),
        }));


        const maxCells = Math.max(...this.TableRowArray.map(row => row.cells.length), 0);
        this.TableHeaderArray = Array.from({ length: maxCells }, (_, i) => i + 1);

        console.log('Loaded table data:', this.TableRowArray);
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error loading table data:', error);
        this.initializeTable();
      }
    } else {
      console.log('No saved data found. Initializing table with default data.');
      this.initializeTable();
    }
  }



  sortTableData() {

    this.TableRowArray.forEach(row => {
        row.cells.sort((cellA, cellB) => {
          const valueA = cellA.value || '';
          const valueB = cellB.value || '';


          const numA = Number(valueA);
          const numB = Number(valueB);


          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }


          return valueA.localeCompare(valueB);
        });
        row.cells.forEach((cell, index) => {
          cell.id = index + 1;

        });

        console.log('Sorted Table Data:', this.TableRowArray);
      }
    )
  }

  isNumber(value: string): boolean {

    return !isNaN(Number(value)) && value.trim() !== '';
  }

  protected readonly Number = Number;



      ValueOftheRow = 0;
       RowNumber = 0;


  AddCellValues(index: number) {
    this.ValueOftheRow = 0;
    let RowNumberData = 0;
    console.log(1);

    RowNumberData = index - 1;

    for (let i = 0; i < this.TableRowArray[RowNumberData].cells.length; i++) {
      const value = this.TableRowArray[RowNumberData].cells[i].value;


      const numericValue = Number(value);


      if (!isNaN(numericValue)) {
        this.ValueOftheRow += numericValue;
      }

      console.log(2);
    }

    let NumberOfCells = this.TableRowArray[RowNumberData].cells.length - 1;
    this.TableRowArray[RowNumberData].cells[NumberOfCells].value = this.ValueOftheRow.toString();

    console.log('value is ' + this.ValueOftheRow);
    console.log(3);
  }


  AddColumnValues(index: number) {

    if (index < 0 || index >= this.TableRowArray[0].cells.length) {
      console.error('Invalid column index.');
      return;
    }


    let columnSum = 0;

    for (let rowIndex = 0; rowIndex < this.TableRowArray.length; rowIndex++) {
      const row = this.TableRowArray[rowIndex];


      const value = row.cells[index]?.value;


      const numericValue = Number(value);

      if (!isNaN(numericValue)) {
        columnSum += numericValue;
      }
    }


    this.TableRowArray[this.TableRowArray.length - 1].cells[index].value = columnSum.toString();

    console.log(`Column ${index} sum: ${columnSum}`);
    console.log('Updated Table:', this.TableRowArray);
  }




  AddCellValuesForAllRows() {

    for (let rowIndex = 0; rowIndex < this.TableRowArray.length; rowIndex++) {
      let row = this.TableRowArray[rowIndex];


      let rowSum = 0;


      for (let i = 0; i < row.cells.length - 1; i++) {
        const value = row.cells[i]?.value;


        const numericValue = Number(value);


        if (!isNaN(numericValue)) {
          rowSum += numericValue;
        }
      }


      row.cells[row.cells.length - 1].value = rowSum.toString();

      console.log(`Row ${rowIndex + 1} value is: ${rowSum}`);
    }

    console.log('Updated Table:', this.TableRowArray);
  }


}
