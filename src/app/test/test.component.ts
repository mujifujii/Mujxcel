import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ExportExcelService} from '../services/export-excel.service';
import {ITableRow} from './interfaces/ITableRow';
import {TableRowAndColoumnGeneratingService} from '../table/services/table-row-and-coloumn-generating.service';
import {DeleteService} from '../table/services/delete.service';
import {TableSortService} from '../table/services/table-sort.service';
import {TableMathService} from '../table/services/table-math.service';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {IRole} from './interfaces/Iroles';



@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})

export class TestComponent implements OnInit {
  TableHeaderArray: number[] = [];
  TableRowArray: ITableRow[] = [];
  rowInput: number = 1;
  headerInput: number = 1;
  TableDataSavedInLocalstorage: ITableRow[] = []
  SearchValue: string = '';

  protected readonly Number = Number;
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #exportExcelService = inject(ExportExcelService);
  readonly #tableRowAndColoumnGeneratingService = inject(TableRowAndColoumnGeneratingService)
  readonly #deleteService = inject(DeleteService);
  readonly #tableSortService = inject(TableSortService);
  readonly #tableMathSerice = inject(TableMathService)


  ngOnInit() {
  this.initializeTable();
  this.getAllRoles()
}

initializeTable() {
  this.TableHeaderArray = [1, 2, 3, 4, 5];
  this.TableRowArray = this.#tableRowAndColoumnGeneratingService.generateRows(5, this.TableHeaderArray.length);
}

exportToExcel() {
  this.#exportExcelService.exportTableToExcel('myTable', 'ExcelMujxcel')
}


ToggleRowVisibility(rowIndex: number) {
  this.TableRowArray[rowIndex].isSelected = !this.TableRowArray[rowIndex].isSelected
}

addRowBelow(rowIndex: number) {
  const result:ITableRow[] = this.#tableRowAndColoumnGeneratingService.addRowBelow(rowIndex, this.TableRowArray, this.TableHeaderArray);
  this.TableRowArray = result;
}

SearchForValue() {
  for (let i = 0; i < this.TableRowArray.length; i++) {
    for (let j = 0; j < this.TableRowArray[i].cells.length; j++) {
      if (this.TableRowArray[i].cells[j].value === this.SearchValue) {
        this.TableRowArray[i].cells[j].isSelected = true
      }
    }
  }
}

DeSelectCells(SearchValue: string) {
  for (let i = 0; i < this.TableRowArray.length; i++) {
    for (let j = 0; j < this.TableRowArray[i].cells.length; j++) {
      if (SearchValue === '') {
        this.TableRowArray[i].cells[j].isSelected = false
      }
      if (this.TableRowArray[i].cells[j].value === this.SearchValue) {
        this.TableRowArray[i].cells[j].isSelected = false
      }
    }
  }
}

SortRow(index: number) {
  this.TableRowArray[index] = this.#tableSortService.sortRow(this.TableRowArray[index]);
}

SortHeaderColumn(Index: number) {
  this.TableRowArray = this.#tableSortService.sortHeaderColumn(Index, this.TableRowArray);
}

addHeaderColumnNextTo(HeaderIndex: number) {
  const result = this.#tableRowAndColoumnGeneratingService.addHeaderColumnNextTo(HeaderIndex, this.TableHeaderArray, this.TableRowArray);
  this.TableHeaderArray = result.headers;
  this.TableRowArray = result.rows;
  this.TableRowArray.forEach(row => {
    row.cells.forEach((cell, index) => (cell.id = index + 1));
  });
}

deleteTableRow(rowIndex: number) {
  this.TableRowArray = this.#deleteService.deleteTableRow(rowIndex, this.TableRowArray);
}

deleteHeaderColumn(headerIndex: number) {
  const result = this.#deleteService.deleteHeaderColumn(headerIndex, this.TableHeaderArray, this.TableRowArray);
  this.TableHeaderArray = result.headers;
  this.TableRowArray = result.rows;
}

addRow() {
  const targetRowCount = this.rowInput;
  const currentRowCount = this.TableRowArray.length;
  if (targetRowCount > currentRowCount) {
    const rowsToAdd = targetRowCount - currentRowCount;
    const newRows = this.#tableRowAndColoumnGeneratingService.generateRows(rowsToAdd, this.TableHeaderArray.length);
    this.TableRowArray.push(...newRows);
  } else if (targetRowCount < currentRowCount) {
    this.TableRowArray.splice(targetRowCount, currentRowCount - targetRowCount);
  }
  this.TableRowArray.forEach((row, index) => (row.id = index + 1));
}

addHeader() {
  this.TableHeaderArray = Array.from({length: this.headerInput}, (_, i) => i + 1);
  this.TableRowArray.forEach((row) => {
    row.cells = this.TableHeaderArray.map((_, index) => ({
      id: index + 1, value: row.cells[index]?.value || '', isSelected: false,
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
  localStorage.setItem('tableData', JSON.stringify(this.TableDataSavedInLocalstorage));
  console.log(this.TableRowArray)
}

fillTableData() {
  const savedData = localStorage.getItem('tableData');
  if (savedData) {
    try {
      const parsedData: ITableRow[] = JSON.parse(savedData);
      parsedData.forEach((savedRow) => {
        const currentRow = this.TableRowArray.find((row) => row.id === savedRow.id);
        if (currentRow) {
          savedRow.cells.forEach((savedCell) => {
            const currentCell = currentRow.cells.find((cell) => cell.id === savedCell.id);
            if (currentCell && currentCell.value === '') {
              currentCell.value = savedCell.value || '';
            }
          });
        }
      });
      this.#changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading table data:', error);
      this.initializeTable();
    }
  } else {
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

  })
}
isNumber(value: string): boolean {
  return !isNaN(Number(value)) && value.trim() !== '';
}

AddCellValues(index: number) {
  this.TableRowArray = this.#tableMathSerice.addCellValues(index, this.TableRowArray)
}

AddColumnValues(index: number) {
  this.TableRowArray = this.#tableMathSerice.addColumnValues(index, this.TableRowArray)
}

AddCellValuesForAllRows() {
  this.TableRowArray = this.#tableMathSerice.addCellValuesForAllRows(this.TableRowArray)
}

roleList:IRole[]= []
http = inject(HttpClient)

  getAllRoles(){
    this.http.get('https://freeapi.miniprojectideas.com/api/ClientStrive/GetAllRoles').subscribe((res:any) =>{
    this.roleList = res.data
    })
  }
  rolesRowIndex: number = -1;

  addRolesToTable() {

    // Check if there's already a row for roles
    if (this.rolesRowIndex === -1) {
      // Create a new row for roles
      const rolesRow: ITableRow = {
        id: this.TableRowArray.length + 1, // Assign a unique ID
        cells: this.TableHeaderArray.map((_, cellIndex) => ({
          id: cellIndex + 1,
          value: cellIndex < this.roleList.length ? this.roleList[cellIndex].role : '', // Add roles to cells
          isSelected: false,
        })),
        isSelected: false,
      };

      // Add the roles row to the table
      this.TableRowArray.push(rolesRow);
      this.rolesRowIndex = this.TableRowArray.length - 1; // Track the index of the roles row
    } else {
      // Update the existing roles row
      this.TableRowArray[this.rolesRowIndex].cells = this.TableHeaderArray.map((_, cellIndex) => ({
        id: cellIndex + 1,
        value: cellIndex < this.roleList.length ? this.roleList[cellIndex].role : '', // Add roles to cells
        isSelected: false,
      }));
    }
  }





}
