import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class ExportExcelService {
  constructor() {}

  exportTableToExcel(tableId: string, fileName: string): void {
    // Get the table element by ID
    const table = document.getElementById(tableId);

    // Convert the table to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    // Create a workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook and trigger the download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
