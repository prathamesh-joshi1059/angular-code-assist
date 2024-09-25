import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { rotate } from 'src/app/theme/utils/app-animation';
import { MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { SubscriptionsContainer } from 'src/app/theme/utils/subscriptions-container';
import { ToggleService } from 'src/app/features/add-placeholder/services/toggle.service';
@Component({
  selector: 'app-foxtrot-wrapper',
  templateUrl: './foxtrot-wrapper.component.html',
  styleUrl: './foxtrot-wrapper.component.scss',
  animations: [rotate],
})

export class FoxtrotWrapperComponent {
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('placeholder') placeholder: MatDrawer;
  @ViewChild('mainContent') mainContent: MatDrawerContent;
  public settings: Settings;
  public showSidenav: boolean = true;

  constructor(public appSettings: AppSettings, public router: Router, private toggleService: ToggleService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.settings.menu = 'vertical';
    this.settings.sidenavIsOpened = true;
    this.settings.sidenavIsPinned = true;

    this.toggleService.toggleDrawer$.subscribe((res) => {
      if(res){
        this.placeholder?.open();
      }else{
        this.placeholder?.close();
      }
    })

  }

  onDrawerToggle(isOpen: boolean) {
    this.toggleService.setDrawerState(isOpen);
  }

}