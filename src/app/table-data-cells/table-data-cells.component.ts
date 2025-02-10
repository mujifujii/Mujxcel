import {Component, Input} from '@angular/core';
import {NgFor} from '@angular/common';
import {DataBaseMujxcel} from '../../DatabaseMujxcel/DataBase';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-table-data-cells',
  imports: [NgFor, FormsModule],
  templateUrl: './table-data-cells.component.html',
  styleUrl: './table-data-cells.component.css',
  standalone: true
})
export class TableDataCellsComponent {
  DataBaseImport = DataBaseMujxcel


inputValue:number| string = "";

  clickfunction(){
    console.log("is working")
    console.log(this.inputValue)
  }
}

