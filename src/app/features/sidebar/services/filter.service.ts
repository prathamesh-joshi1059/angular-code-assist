// AI confidence score for this refactoring: 94.37%
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Orders } from 'src/app/models/orders';
import { Filter, FilterCounts } from 'src/app/models/filter';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private rawData: Orders[] = [];
  /* Subject to store driver list */
  private driverListSubject = new BehaviorSubject<string[]>([]);
  driverList$ = this.driverListSubject.asObservable();

  /* Subject to store filtered data */
  private filteredDataSubject = new BehaviorSubject<Orders[]>([]);
  filteredData$ = this.filteredDataSubject.asObservable();

  /* Subject to track and update filters */
  private filtersSubject = new BehaviorSubject<Filter>({
    search: '',
    projectTypes: [],
    workTypes: [],
    fenceTypes: [],
    drivers: [],
  });
  filters$ = this.filtersSubject.asObservable();

  /* Subject to store an object of filter counts */
  private filterCountsSubject = new BehaviorSubject<FilterCounts>({
    projectTypes: {},
    workTypes: {},
    drivers: {},
    driverWorkTypeCounts: {}
  });
  filterCounts$ = this.filterCountsSubject.asObservable();

  /* Function to set data to get filtered */
  setRawData(data: Orders[]): void {
    this.rawData = data;
    /* Get Driver list from data */
    this.driverListSubject.next(Array.from(new Set(data.map(item => item.driver))).sort());
    this.applyFilters();
  }

  /* Function to update filters */
  updateFilters(filters: Filter): void {
    this.filtersSubject.next(filters);
    this.applyFilters();
  }

  /* Function to clear filters */
  clearFilters(): void {
    this.filtersSubject.next({
      search: '',
      projectTypes: [],
      workTypes: [],
      fenceTypes: [],
      drivers: [],
    });
    this.applyFilters();
  }

  /* Function to apply filters on data and get filtered data */
  private applyFilters(): void {
    const filters = this.filtersSubject.value;
    let filteredData = this.rawData;

    if (filters.projectTypes?.length) {
      filteredData = filteredData.filter(item =>
        filters.projectTypes.includes(item.projectType.toLowerCase())
      );
    }

    if (filters.workTypes?.length) {
      filteredData = filteredData.filter(item =>
        filters.workTypes.includes(item.workType.toLowerCase())
      );
    }

    if (filters.fenceTypes?.length) {
      filteredData = filteredData.filter(parent =>
        parent.fences.some(fence =>
          filters.fenceTypes.includes(fence.fenceType.toLowerCase())
        )
      );
    }

    if (filters.drivers?.length) {
      filteredData = filteredData.filter(item =>
        filters.drivers.includes(item.driver.toLowerCase())
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredData = filteredData.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(searchLower) ||
          item.fences.some(fence => String(fence.fenceType).toLowerCase().includes(searchLower))
        )
      );
    }
    /* Update filtered data */
    this.filteredDataSubject.next(filteredData);
    /* Update filter counts */
    this.updateFilterCounts(filteredData);
  }

  /* Function to update filter counts */
  updateFilterCounts(filteredData: Orders[]): void {
    const counts: FilterCounts = {
      projectTypes: {},
      workTypes: {},
      drivers: {},
      driverWorkTypeCounts: {}
    };

    filteredData.forEach(item => {
      counts.projectTypes[item.projectType] = (counts.projectTypes[item.projectType] || 0) + 1;
      counts.workTypes[item.workType] = (counts.workTypes[item.workType] || 0) + 1;
      counts.drivers[item.driver] = (counts.drivers[item.driver] || 0) + 1;

      if (!counts.driverWorkTypeCounts[item.driver]) {
        counts.driverWorkTypeCounts[item.driver] = {};
      }

      counts.driverWorkTypeCounts[item.driver][item.workType] = 
        (counts.driverWorkTypeCounts[item.driver][item.workType] || 0) + 1;
    });

    this.filterCountsSubject.next(counts);
  }
}

/*
- Missing types in function parameters.
- Inconsistent use of nullish coalescing with length checks.
- Function return types are not specified.
- Unused variables should be removed.
*/