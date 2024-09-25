import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Orders } from 'src/app/models/orders';

describe('FilterService', () => {
  let service: FilterService;

  const mockData: Orders[] = [
    {
      projectType: 'Construction',
      clientName: 'John Doe',
      startDate: '2022-01-01',
      endDate: '2022-01-31',
      address: '123 Main St',
      phone: '555-1234',
      orderId: '123456',
      fences: [
        {
          fenceType: 'Panel w/Posts',
          noOfUnits: 10
        },
        {
          fenceType: 'Barricade',
          noOfUnits: 5
        }
      ],
      workType: 'DRP',
      driver: 'Marc Jacobs',
      isPlaceholder: false,
      url: '',
      notes: '',
      branch: 'MEL',
      geoPoint: {
        latitude: 41.7652688,
        longitude: -72.68012
      }
    },
    {
      projectType: 'Event',
      clientName: 'Jane Doe',
      startDate: '2022-02-01',
      endDate: '2022-02-28',
      address: '456 Elm St',
      phone: '555-5678',
      orderId: '654321',
      fences: [
        {
          fenceType: 'Panel w/Stands',
          noOfUnits: 8
        },
        {
          fenceType: 'Rolled Chainlinks',
          noOfUnits: 3
        }
      ],
      workType: 'DEL',
      driver: 'Marc Jacobs',
      isPlaceholder: false,
      url: '',
      notes: '',
      branch: 'NYC',
      geoPoint: {
        latitude: 41.7652688,
        longitude: -72.68012
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: []
    });
    service = TestBed.inject(FilterService);
    service.setRawData(mockData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should filter data by project type', () => {
    service.updateFilters({ search: '', projectTypes: ['construction'], workTypes: [], fenceTypes: [], drivers: [] });
    service.filteredData$.subscribe(filteredData => {
      expect(filteredData.every(item => item.projectType === 'Construction')).toBeTrue();
      expect(filteredData.length).toBe(1);
    });
  });

  it('should filter data by work type', () => {
    service.updateFilters({ search: '', projectTypes: [], workTypes: ['drp'], fenceTypes: [], drivers: [] });
    service.filteredData$.subscribe(filteredData => {
      expect(filteredData.length).toBe(1);
      expect(filteredData.every(item => item.workType === 'DRP')).toBeTrue();
    });
  });

  it('should filter data by fence type', () => {
    service.updateFilters({ search: '', projectTypes: [], workTypes: [], fenceTypes: ['rolled chainlinks'], drivers: [] });
    service.filteredData$.subscribe(filteredData => {
      expect(filteredData.length).toBe(1);
      expect(filteredData.every(parent => parent.fences.some(fence => fence.fenceType === 'Rolled Chainlinks'))).toBeTrue();
    });
  });

  it('should filter data by driver', () => {
    service.updateFilters({ search: '', projectTypes: [], workTypes: [], fenceTypes: [], drivers: ['marc jacobs'] });
    service.filteredData$.subscribe(filteredData => {
      expect(filteredData.length).toBe(2);
      expect(filteredData[0].driver).toBe('Marc Jacobs');
    });
  });

  it('should filter data by search term', () => {
    service.updateFilters({ search: 'Marc', projectTypes: [], workTypes: [], fenceTypes: [], drivers: [] });
    service.filteredData$.subscribe(filteredData => {
      expect(filteredData.length).toBe(2);
      expect(filteredData[0].driver).toBe('Marc Jacobs');
    });
  });

  it('should reset filters', () => {
    service.updateFilters({ search: 'Construction', projectTypes: [''], workTypes: [''], fenceTypes: [''], drivers: [''] });
    service.clearFilters();
    service.filteredData$.subscribe(filteredData => {
      expect(filteredData.length).toBe(mockData.length);
    });
  });

  it('should update filter counts correctly', () => {
    service.updateFilterCounts(mockData);

    service.filterCounts$.subscribe(counts => {
      expect(counts).toBeTruthy();
      expect(counts.projectTypes).toEqual({ Construction: 1, Event: 1 });
      expect(counts.workTypes).toEqual({ DRP: 1, DEL: 1 });
      expect(counts.drivers).toEqual({ "Marc Jacobs": 2 });
      expect(counts.driverWorkTypeCounts).toEqual({
        "Marc Jacobs": { DRP: 1, DEL: 1 },
      });
    });
  });

  it('should handle empty input correctly', () => {
    service.updateFilterCounts([]);

    service.filterCounts$.subscribe(counts => {
      expect(counts).toBeTruthy();
      expect(counts.projectTypes).toEqual({});
      expect(counts.workTypes).toEqual({});
      expect(counts.drivers).toEqual({});
      expect(counts.driverWorkTypeCounts).toEqual({});
    });
  });

  it('should handle single item input correctly', () => {
    const singleItem: Orders = {
      projectType: 'Construction',
      clientName: 'John Doe',
      startDate: '2022-01-01',
      endDate: '2022-01-31',
      address: '123 Main St',
      phone: '555-1234',
      orderId: '123456',
      fences: [
        {
          fenceType: 'Panel w/Posts',
          noOfUnits: 10
        },
        {
          fenceType: 'Barricade',
          noOfUnits: 5
        }
      ],
      workType: 'DRP',
      driver: 'Marc Jacobs',
      isPlaceholder: false,
      url: '',
      notes: '',
      branch: 'MEL',
      geoPoint: {
        latitude: 41.7652688,
        longitude: -72.68012
      }
    };

    service.updateFilterCounts([singleItem]);

    service.filterCounts$.subscribe(counts => {
      expect(counts).toBeTruthy();
      expect(counts.projectTypes).toEqual({ Construction: 1 });
      expect(counts.workTypes).toEqual({ DRP: 1 });
      expect(counts.drivers).toEqual({ "Marc Jacobs": 1 });
      expect(counts.driverWorkTypeCounts).toEqual({ "Marc Jacobs": { DRP: 1 } });
    });
  });

});
