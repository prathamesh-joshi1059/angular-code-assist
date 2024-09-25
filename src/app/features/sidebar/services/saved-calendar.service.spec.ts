import { TestBed } from '@angular/core/testing';

import { SavedCalendarService } from './saved-calendar.service';
import { CustomView } from 'src/app/models/custom-view';
import { ApiService } from 'src/app/shared/Services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { FilterService } from './filter.service';
import { Orders } from 'src/app/models/orders';
import { of, throwError } from 'rxjs';

describe('SavedCalendarService', () => {
  let savedCalService: SavedCalendarService;
  let apiService: ApiService;
  let filterService: FilterService;
  let httpTestingController: HttpTestingController;
  const toastrServiceStub = {
    success: (message: string) => { },
    error: (message: string) => { },
    info: (message: string) => { },
  };
  beforeEach(() => {
    const mockFilterService = jasmine.createSpyObj('FilterService', [
      'setRawData',
    ]);

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        ApiService,
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: FilterService, useValue: mockFilterService },
      ],
    });
    savedCalService = TestBed.inject(SavedCalendarService);
    apiService = TestBed.inject(ApiService);
    filterService = TestBed.inject(FilterService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

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
          noOfUnits: 10,
        },
        {
          fenceType: 'Barricade',
          noOfUnits: 5,
        },
      ],
      workType: 'DRP',
      driver: 'Marc Jacobs',
      isPlaceholder: false,
      notes: '',
      url: '',
      branch: '',
      latitude: 0,
      longitude: 0
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
          noOfUnits: 8,
        },
        {
          fenceType: 'Rolled Chainlinks',
          noOfUnits: 3,
        },
      ],
      workType: 'DEL',
      driver: 'Marc Jacobs',
      isPlaceholder: false,
      notes: '',
      url: '',
      branch: '',
      latitude: 0,
      longitude: 0
    },
  ];

  const emptyData = [];

  const mockResponse = {
    statusCode: 1000,
    message: 'Orders retrieved successfully',
    data: mockData,
  };
  const mockResponseEmptyData = {
    statusCode: 1000,
    message: 'Orders not found',
    data: emptyData,
  };

  const mockResponseErr = {
    statusCode: 1001,
    message: 'Failed to load',
    data: [],
  };

  const mockUpdateCalResponse = {
    statusCode: 1000,
    message: 'Calendar Updated Successfully',
    data: [
      {
        orders: [],
        defaultCalendarView: 'Robs Calendar',
        calendarList: [
          {
            calendarName: 'Andree Calendar',
            branches: ['NYC'],
            isFavorite: false,
            isDefault: false,
          },
          {
            calendarName: 'Test Calendar',
            branches: ['PTA'],
            isFavorite: false,
            isDefault: true,
          },
          {
            calendarName: "Rock's Calendar",
            branches: ['MEL'],
            isFavorite: true,
            isDefault: false,
          },
        ],
      },
    ],
  };

  const view = { branches: ['MEL'], yearMonth: '2022-12' };
  const calendar = {
    userId: '123',
    calendarName: 'Test Calendar',
    isDefault: true,
    isFavorite: false,
  };
  it('should be created', () => {
    expect(savedCalService).toBeTruthy();
  });

  it('setBranches() and getBrnaches() should set and get branches correctly', () => {
    const branches = ['MEL', 'RIV'];
    savedCalService.setBranches(branches);
    expect(savedCalService.getBranches()).toEqual(branches);
  });

  //updateCalList()
  it(' updateCalList() should update the calListSubject with new calendar list', () => {
    const newCalList: CustomView[] = [
      {
        calendarName: 'Rob Calendar',
        isDefault: true,
        isFavorite: false,
        branches: [],
      },
      {
        calendarName: 'Mark Calendar',
        isDefault: false,
        isFavorite: true,
        branches: ['MEL'],
      },
    ];
    savedCalService.updateCalList(newCalList);
    savedCalService.calLists$.subscribe((calList) => {
      expect(calList).toEqual(newCalList);
    });
  });

  //getViewOrders()
  it('getViewOrders() should return orders for selected calendar view', () => {
    spyOn(apiService, 'postData').and.returnValue(of(mockResponseEmptyData));
    spyOn(toastrServiceStub, 'info');
    savedCalService.getViewOrders(view);
    expect(filterService.setRawData).toHaveBeenCalledWith(mockResponseEmptyData['data']);
    expect(toastrServiceStub.info).toHaveBeenCalled();
  });

  it('getViewOrders()should set raw data and show info toast for empty data response', () => {
    spyOn(apiService, 'postData').and.returnValue(of(mockResponseEmptyData));
    spyOn(toastrServiceStub, 'info');

    savedCalService.getViewOrders(view);

    expect(filterService.setRawData).toHaveBeenCalledWith(mockResponseEmptyData.data);
    expect(toastrServiceStub.info).toHaveBeenCalled();
  });

  it('getViewOrders() should set raw data and show error toast for error response', () => {
    spyOn(apiService, 'postData').and.returnValue(throwError(mockResponseErr));
    spyOn(toastrServiceStub, 'error');

    savedCalService.getViewOrders(view);

    expect(filterService.setRawData).not.toHaveBeenCalled();
    expect(toastrServiceStub.error).toHaveBeenCalled();
  });

  it('getViewOrders() should handle empty data', () => {
    spyOn(apiService, 'postData').and.returnValue(of(mockResponseEmptyData));
    spyOn(toastrServiceStub, 'info');
    savedCalService.getViewOrders(view);
    expect(filterService.setRawData).toHaveBeenCalledWith(
      mockResponseEmptyData['data']
    );
    expect(toastrServiceStub.info).toHaveBeenCalled();
  });

  it('getViewOrders() should handle falied API response', () => {
    spyOn(apiService, 'postData').and.returnValue(of(mockResponseErr));
    spyOn(toastrServiceStub, 'error');
    savedCalService.getViewOrders(view);
    expect(toastrServiceStub.error).toHaveBeenCalled();
  });



  //updateCalendar()
  it(' updateCalendar() should update calendar details ', (done) => {

    spyOn(apiService, 'postData').and.returnValue(of(mockUpdateCalResponse));
    spyOn(savedCalService, 'updateCalList');
    savedCalService.updateCalendar(calendar).subscribe((data) => {
      expect(savedCalService.updateCalList).toHaveBeenCalledWith(
        mockUpdateCalResponse.data[0]['calendarList']
      );
      expect(data).toEqual(mockUpdateCalResponse.data[0]['calendarList']);
      done();
    });
  });


   
    //getView()
    it('getView() should set raw data and call getViewOrders if branches are provided', () => {
  
      const branches = ['MLE', 'RIV'];
      const date = '2024-07-01';
      spyOn(savedCalService, 'getViewOrders')
      savedCalService.getView(branches, date);
  
      expect(filterService.setRawData).toHaveBeenCalledWith([]);
      
      const expectedYearMonth = '2024-07'; 
      const expectedView = {
        branches: branches,
        yearMonth: expectedYearMonth
      };
      expect(savedCalService.getViewOrders).toHaveBeenCalledWith(expectedView);
    });

})
