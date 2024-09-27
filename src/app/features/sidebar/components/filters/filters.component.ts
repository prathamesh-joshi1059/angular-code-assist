// AI confidence score for this refactoring: 91.14%
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { fenceType, projectType, workTypes } from 'src/assets/data/constants';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  projectType = projectType;
  workType = workTypes;
  fenceType = fenceType;
  countsObj: any;

  driversData: string[] = [];
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService
  ) {
    this.filterForm = this.fb.group({
      search: '',
      projectTypes: [[]],
      workTypes: [[]],
      fenceTypes: [[]],
      drivers: [[]],
    });
  }

  ngOnInit() {
    /* Always start with empty values */
    this.filterForm.patchValue({
      projectTypes: [],
      workTypes: [],
      fenceTypes: [],
      drivers: [],
    });
    /* Subscribe to get Driver from data */
    this.filterService.driverList$.subscribe(drivers => {
      this.driversData = drivers;
    });
    /* Subscribe to get Filter Counts */
    this.filterService.filterCounts$.subscribe(counts => {
      this.countsObj = counts;
    });
  }

  /* reset form and clear filters */
  formReset() {
    this.filterForm.reset();
    this.filterService.clearFilters();
  }

  /* remove chips from selected filter and update filters */
  remove(value: string, type: string) {
    const formControl = this.filterForm.get(type);
    if (formControl) {
      const currentValue = formControl.value;
      const index = currentValue.indexOf(value);
      if (index !== -1) {
        currentValue.splice(index, 1);
        formControl.patchValue(currentValue);
      }
      this.update();
    }
  }

  /* get work type color */
  getWorkTypeColor(work: string): string {
    const selectedWorkType = workTypes.find((type) => type.workType.toLowerCase() === work.toLowerCase());
    return selectedWorkType ? selectedWorkType.color : '#FFFFFF';
  }

  /* get work type name from abbreviation */
  getWorkTypeName(workType: string): string {
    const workTypeObj = workTypes.find(obj => obj.workType === workType);
    return workTypeObj ? workTypeObj.workTypeDesc : '';
  }

  /* get count for drivers orders all */
  getDriverOrderCount(driver: string): number {
    return this.countsObj.drivers[this.titleCase(driver)] || 0;
  }

  /* get all work type count for driver */
  getDriverAllWorkType(driver: string): string[] {
    if (this.countsObj.driverWorkTypeCounts[this.titleCase(driver)]) {
      return Object.keys(this.countsObj.driverWorkTypeCounts[this.titleCase(driver)]);
    }
    return [];
  }

  /* Convert string to title case */
  titleCase(str: string): string {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  /* update filters */
  update() {
    const formData = this.filterForm.value;
    this.filterService.updateFilters(formData);
  }

  /* handle enter key press in search input */
  handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }
}

/* Issues: 
- 'styleUrl' should be 'styleUrls'.
- countsObj is defined as 'any' instead of a more specific type.
- The 'search' field is initialized with an empty string instead of a FormControl.
- A constructor is being used to initialize filterForm, it can be defined directly in the class property.
- handleKeyPress parameter type is not explicitly defined.
*/