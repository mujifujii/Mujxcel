import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDataCellsComponent } from './table-data-cells.component';

describe('TableDataCellsComponent', () => {
  let component: TableDataCellsComponent;
  let fixture: ComponentFixture<TableDataCellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDataCellsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDataCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
