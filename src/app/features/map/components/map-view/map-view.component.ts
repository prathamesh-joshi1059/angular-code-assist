import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapViewService } from '../../services/map-view.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CalendarControlService } from 'src/app/features/calendar/services/calendar-control.service';
import { FilterService } from 'src/app/features/sidebar/services/filter.service';
import { Orders } from 'src/app/models/orders';
import { SavedCalendarService } from 'src/app/features/sidebar/services/saved-calendar.service';
import { DatePipe } from '@angular/common';
import { workTypes } from 'src/assets/data/constants';
import { ToggleService } from 'src/app/features/add-placeholder/services/toggle.service';
import { MatDialog } from '@angular/material/dialog';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class MapViewComponent {
  day: Date;
  branches: string[];
  workTypeConst = workTypes;
  date = new DatePipe('en-US');
  dataSource: Orders[] = [];
  columnsToDisplay = ['workAndProject', 'order', 'clientName', 'address', 'fenceType', 'driver', 'notes'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay];
  expandedElement: Orders | null;
  tTipindex: number;
  markers: Orders[];
  private destroy$ = new Subject<void>();
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  constructor(
    private mapService: MapViewService,
    private route: Router,
    private calendarService: CalendarControlService,
    private filterService: FilterService,
    private savedCalendarService: SavedCalendarService,
    private toggleService: ToggleService,
    private dialog: MatDialog
  ) { }

  /* Google map options */
  mapOptions: google.maps.MapOptions = {
    zoom: 14,
    fullscreenControl: false,
  };

  ngOnInit() {
    /* store branches of selected calendar */
    this.branches = this.savedCalendarService.getBranches();
    /* date value check */
    if (this.mapService.getDate()) {
      this.day = this.mapService.getDate();
      this.toggleService.day = this.day;
      this.getOrders(this.day);
      this.calendarService.selectedMonth(this.day);
    } else {
      this.route.navigate(['calendar']);
    }
  }
  /* calls getOrder() to get the orders for respective day */
  getOrders(day) {
    let payload = {
      date: this.date.transform(day, 'YYYY-MM-dd'),
      branches: this.branches
    }
    this.mapService.getMapViewOrders(payload);

    this.filterService.filteredData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(filteredData => {
      this.dataSource = filteredData;
      this.getMarkerByWorkTypes(filteredData)
    });
  }


  /* Bounds for map (Determine the center point of the map view based on the locations of pins)*/
  getBounds(markers: Orders[]) {
    let north;
    let south;
    let east;
    let west;
    if (markers?.length > 0) {
      for (const marker of markers) {
        north =
          north !== undefined
            ? Math.max(north, marker.geoPoint.latitude)
            : marker.geoPoint.latitude;
        south =
          south !== undefined
            ? Math.min(south, marker.geoPoint.latitude)
            : marker.geoPoint.latitude;
        east =
          east !== undefined
            ? Math.max(east, marker.geoPoint.longitude)
            : marker.geoPoint.longitude;
        west =
          west !== undefined
            ? Math.min(west, marker.geoPoint.longitude)
            : marker.geoPoint.longitude;
      }
    }
    const bounds = { north, south, east, west };
    return bounds;
  }
  /* Navigate to the next day and fetch orders for that day */
  nextDate(date) {
    const currentDate = new Date(date);
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
    this.day = nextDate;
    this.calendarService.selectedMonth(this.day);
    this.getOrders(this.day);
    this.toggleService.day = this.day;
  }
  /* Navigate to the next day and fetch orders for that day */
  prevDate(date) {
    let currentDate = new Date(date);
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );
    this.day = previousDate;
    this.calendarService.selectedMonth(this.day);
    this.getOrders(this.day);
    this.toggleService.day = this.day;
  }

  /* Open dialog box for adding or editing notes */
  openDialog(e) {
    this.dialog.open(NotesDialogComponent, { data: e, width: '447px' }).afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (res) {
        //refersh table code goes here
        this.getOrders(this.day)
      }
    })
  }
  /* returns worktype color  */
  getWorkTypeColor(workType: string): string {
    const workTypeObj = this.workTypeConst.find(obj => obj.workType === workType);
    return workTypeObj ? workTypeObj.color : '';
  }
  /* Return worktype from abbreviations */
  getWorkTypeName(workType: string): string {
    const workTypeObj = this.workTypeConst.find(obj => obj.workType === workType);
    return workTypeObj ? workTypeObj.workTypeDesc : '';
  }

  /* Open and edit placeholder */
  editPlaceholder(order: Orders) {
    this.toggleService.openDrawer();
    this.toggleService.setOrders(order)
  }
  /* Delete placeholder on delete click */
  deletePlaceholder(orderId: string) {
    this.toggleService.deletePlaceholder(orderId);
  }

  /* Function to display tooltip infoWindow */
  openInfoWindow(data: Orders, marker: MapMarker, index) {
    this.tTipindex = index;
    this.infoWindow?.open(marker);
  }
  /* Function to display tooltip infoWindow */
  closeInfoWindow() {
    this.infoWindow.close();
  }
  /* Function to find pin as per worktype and add in object */
  getMarkerByWorkTypes(data: Orders[]) {
    this.markers = data?.map(item => {
      const matchedWorkType = workTypes.find(workType => workType.workType === item.workType.trim());
      return {
        ...item,
        pin: matchedWorkType ? matchedWorkType.pin : null
      };
    });
    let bounds = this.getBounds(this.markers)
    /* bounds for map (dynamic center as per order location) */
    if (this.map && this.map.googleMap && (bounds.east || bounds.west || bounds.north || bounds.south)) {
      this.map.googleMap.fitBounds(this.getBounds(this.markers));
    }
  }
  ngOnDestroy() {
    /* clears data from filter service and destroys map as well as unsubscribe to all services */
    this.destroy$.next();
    this.destroy$.complete();
    this.map.googleMap = undefined;
    this.filterService.setRawData([]);
  }
}
