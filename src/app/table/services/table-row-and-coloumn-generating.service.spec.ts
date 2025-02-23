import { TestBed } from '@angular/core/testing';

import { TableRowAndColoumnGeneratingService } from './table-row-and-coloumn-generating.service';

describe('TableRowAndColoumnGeneratingService', () => {
  let service: TableRowAndColoumnGeneratingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableRowAndColoumnGeneratingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
