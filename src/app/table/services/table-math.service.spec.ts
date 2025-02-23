import { TestBed } from '@angular/core/testing';

import { TableMathService } from './table-math.service';

describe('TableMathService', () => {
  let service: TableMathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableMathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
