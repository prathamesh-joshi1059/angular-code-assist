import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'Foxtrot',   //theme name
        true,       //loadingSpinner
        false,      //fixedHeader
        true,      //fixedSidenav 
        false,      //fixedFooter
        true,       //sidenavIsOpened
        true,       //sidenavIsPinned  
        'vertical', //horizontal , vertical
        'default',  //default, compact, mini
        'foxtrot-theme',   //foxtrot-theme
        false       // true = rtl, false = ltr
    )
}

