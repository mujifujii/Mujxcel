import {ITableCell} from './ITableCell';

export interface ITableRow {
  id: number;
  cells: ITableCell[];
  isSelected: boolean;
}
