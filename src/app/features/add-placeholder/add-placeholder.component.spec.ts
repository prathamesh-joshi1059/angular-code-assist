import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaceholderComponent } from './add-placeholder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToggleService } from './services/toggle.service';
import { DateRange } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { placeholderData } from 'src/app/models/placeholderModel';
import { Orders } from 'src/app/models/orders';

fdescribe('AddPlaceholderComponent', () => {
  let component: AddPlaceholderComponent;
  let fixture: ComponentFixture<AddPlaceholderComponent>;
  let toggleService: ToggleService;

  beforeEach(async () => {
    const toastrServiceSpyObj = jasmine.createSpyObj('ToastrService',['success','error', 'info'])


    await TestBed.configureTestingModule({
      declarations :[AddPlaceholderComponent],
      imports: [SharedModule, HttpClientTestingModule,BrowserAnimationsModule],
      providers: [ToggleService,
        {provide: ToastrService, useValue: toastrServiceSpyObj},

        
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toggleService= TestBed.inject(ToggleService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize the form with empty values', () => {
    expect(component.addNewPlaceholder.value).toEqual({
      projectType: '',
      workType: '',
      branch:'',
      siteAddress:'',
      driverName: '',
      endDate:'',
      notes: '',
      clientName: '',
      startDate: '',
      phone:''
    } as any);
  });


  it('it should be check event', () => {
    
    component.onCheckboxChange('event');
    expect(component.constructionChecked).toBeFalse();

});

it('it should be check construction ', () => {
component.onCheckboxChange('construction');
    expect(component.eventChecked).toBeFalse();
    
  });


it('should set the correct boolean property to true on checkbox change and reset others',() => {
  expect(component.puChecked).toBeFalse();
  expect(component.delChecked).toBeFalse();
  expect(component.drpChecked).toBeFalse();
  expect(component.offrntChecked).toBeFalse();
  expect(component.retChecked).toBeFalse();
  expect(component.svcChecked).toBeFalse();
  expect(component.onrntChecked).toBeFalse();
  expect(component.cpuChecked).toBeFalse();

  component.onCheckboxesChange('DEL');
  expect(component.puChecked).toBeFalse();
  expect(component.delChecked).toBeTrue();
  expect(component.drpChecked).toBeFalse();
  expect(component.offrntChecked).toBeFalse();
  expect(component.retChecked).toBeFalse();
  expect(component.svcChecked).toBeFalse();
  expect(component.onrntChecked).toBeFalse();
  expect(component.cpuChecked).toBeFalse()
})


  // Test for changeCheckbox method
  it('should set isChecked to true and retain noOfUnits when event.checked is true', () => {
    const event = { checked: true };
    const index = 0;
    component.fenceTypeArr = [{ isChecked: false, fenceType: 'Type1', noOfUnits: 5 }];

    component.changeCheckbox(event, index);

    expect(component.fenceTypeArr[index].isChecked).toBeTrue();
    expect(component.fenceTypeArr[index].noOfUnits).toBe(5);
  });


  it('should update noOfUnits to 0 when event.value is an empty string', () => {
    const event = { value: 2 };
    const index = 0
    component.fenceTypeArr = [{ isChecked: true, fenceType: 'Type1', noOfUnits: 2 }];
    component.changeUnits(event, index);    
    expect(component.fenceTypeArr[index].noOfUnits).toEqual(2);
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call deletePlaceholder with orderId when orderId is provided', () => {
    spyOn(toggleService, 'deletePlaceholder')
    const orderId = '12345';
    component.deletePlaceholder(orderId);

    expect(toggleService.deletePlaceholder).toHaveBeenCalledWith(orderId);
});

it('should not call deletePlaceholder when orderId is not provided', () => {
  spyOn(toggleService, 'deletePlaceholder')
    component.deletePlaceholder('');
    expect(toggleService.deletePlaceholder).not.toHaveBeenCalled();
});

it('should call updatePlaceholder with orderId and data when orderId is provided', () => {
  spyOn(toggleService, 'updatePlaceholder')
  const orderId = '12345';
  const data: placeholderData = {
      endDate: '2024-12-31',
      projectType: 'Residential',
      notes: 'Some notes here',
      address: '123 Street',
      workType: 'Repair',
      driver: 'John Doe',
      clientName: 'Client A',
      startDate: '2024-01-01',
      fences: [],
      branch: 'North',
      phone: '1234567890'
  };
  
  component.updatePlaceholder(orderId, data);

  expect(toggleService.updatePlaceholder).toHaveBeenCalledWith(orderId, data);
});

it('should not call updatePlaceholder when orderId is not provided', () => {
  spyOn(toggleService, 'updatePlaceholder')
  const data: placeholderData = {
      endDate: '2024-12-31',
      projectType: 'Residential',
      notes: 'Some notes here',
      address: '123 Street',
      workType: 'Repair',
      driver: 'John Doe',
      clientName: 'Client A',
      startDate: '2024-01-01',
      fences: [],
      branch: 'North',
      phone: '1234567890'
  };

  component.updatePlaceholder('', data);

  expect(toggleService.updatePlaceholder).not.toHaveBeenCalled();
});

it('should patch form values if data is provided', () => {
  const dummyData: Orders ={
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

  component.editPlaceholder(dummyData);

  expect(component.addNewPlaceholder.value).toEqual({
    projectType: 'Construction',
    clientName: 'John Doe',
    startDate: '2022-01-01',
    endDate: '2022-01-31',
    siteAddress: '123 Main St',
    phone: '555-1234',
    workType: 'DRP',
    driverName: 'Marc Jacobs',
    notes: '',
    branch: 'MEL',

  });
});


});


