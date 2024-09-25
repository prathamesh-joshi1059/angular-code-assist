import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FilterService } from '../../services/filter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FiltersComponent } from './filters.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { workTypes } from 'src/assets/data/constants';
import { By } from '@angular/platform-browser';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let filterService: FilterService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [FilterService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    filterService = TestBed.inject(FilterService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.filterForm.value).toEqual({
      search: '',
      projectTypes: [],
      workTypes: [],
      fenceTypes: [],
      drivers: []
    } as any);
  });

  it('should reset the form', () => {
    component.filterForm.setValue({
      search: 'test',
      projectTypes: ['type1', 'type2'],
      workTypes: ['work1', 'work2'],
      fenceTypes: ['fence1', 'fence2'],
      drivers: ['driver1', 'driver2']
    } as any);

    component.formReset();

    expect(component.filterForm.value).toEqual({
      search: null,
      projectTypes: null,
      workTypes: null,
      fenceTypes: null,
      drivers: null
    } as any);
  });

  it('should remove an item from the specified form control', () => {
    component.filterForm.patchValue({
      search: '',
      projectTypes: ['type1', 'type2'],
      workTypes: ['work1', 'work2'],
      fenceTypes: ['fence1', 'fence2'],
      drivers: ['driver1', 'driver2']
    } as any);

    component.remove('type1', 'projectTypes');
    expect(component.filterForm.value.projectTypes).toEqual(["type2"])

    component.remove('work2', 'workTypes');
    expect(component.filterForm.value.workTypes).toEqual(["work1"])

    component.remove('fence1', 'fenceTypes');
    expect(component.filterForm.value.fenceTypes).toEqual(["fence2"])

    component.remove('driver2', 'drivers');
    expect(component.filterForm.value.drivers).toEqual(["driver1"])

  });

  it('should update filters when update() is called', () => {
    spyOn(filterService, 'updateFilters');
    component.filterForm.setValue({
      search: 'test',
      projectTypes: ['type1', 'type2'],
      workTypes: ['work1', 'work2'],
      fenceTypes: ['fence1', 'fence2'],
      drivers: ['driver1', 'driver2']
    } as any);

    component.update();
    expect(filterService.updateFilters).toHaveBeenCalledWith({
      search: 'test',
      projectTypes: ['type1', 'type2'],
      workTypes: ['work1', 'work2'],
      fenceTypes: ['fence1', 'fence2'],
      drivers: ['driver1', 'driver2']
    });
  });

  it('should return correct work type color', () => {
    for (let worktype of workTypes) {
      const workTypeColor = component.getWorkTypeColor(worktype.workType);
      if (worktype.workType === 'DEL') {
        expect(workTypeColor).toEqual('#FB8C00');
      } else if (worktype.workType === 'CPU') {
        expect(workTypeColor).toEqual('#2798F7');
      } else if (worktype.workType === 'CRT') {
        expect(workTypeColor).toEqual('#82CDED');
      } else if (worktype.workType === 'DRP') {
        expect(workTypeColor).toEqual('#4A9336');
      } else if (worktype.workType === 'OFFRNT') {
        expect(workTypeColor).toEqual('#6B7280');
      } else if (worktype.workType === 'ONRNT') {
        expect(workTypeColor).toEqual('#EA2A6F');
      } else if (worktype.workType === 'PU') {
        expect(workTypeColor).toEqual('#DC2626');
      } else if (worktype.workType === 'RET') {
        expect(workTypeColor).toEqual('#34D399');
      } else if (worktype.workType === 'RPR') {
        expect(workTypeColor).toEqual('#6366F1');
      } else if (worktype.workType === 'SVC') {
        expect(workTypeColor).toEqual('#6366F1');
      } else {
        expect(workTypeColor).toEqual('#FFFFFF')
      }
    }
  });

  it('should prevent default action on Enter key press', () => {
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    let inputElement = fixture.debugElement.query(By.css('#searchFilter')).nativeElement;
    inputElement.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should return correct work type name', () => {
    for (let worktype of workTypes) {
      const workTypeName = component.getWorkTypeName(worktype.workType);
      if (worktype.workType === 'DEL') {
        expect(workTypeName).toEqual('Delivery & Install');
      } else if (worktype.workType === 'CPU') {
        expect(workTypeName).toEqual('Customer Pickup');
      } else if (worktype.workType === 'CRT') {
        expect(workTypeName).toEqual('Customer Return');
      } else if (worktype.workType === 'DRP') {
        expect(workTypeName).toEqual('Drop Only');
      } else if (worktype.workType === 'OFFRNT') {
        expect(workTypeName).toEqual('Off Rent');
      } else if (worktype.workType === 'ONRNT') {
        expect(workTypeName).toEqual('On Rent');
      } else if (worktype.workType === 'PU') {
        expect(workTypeName).toEqual('Pick Up Only');
      } else if (worktype.workType === 'RET') {
        expect(workTypeName).toEqual('Takedown & Return');
      } else if (worktype.workType === 'RPR') {
        expect(workTypeName).toEqual('Repair & Service');
      } else if (worktype.workType === 'SVC') {
        expect(workTypeName).toEqual('Services');
      } else {
        expect(workTypeName).toEqual('')
      }
    }
  });

});
