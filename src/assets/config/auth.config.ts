import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../environments/environment';
const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
    auth: {
        clientId: `${environment.clientId}`,
        redirectUri: `${environment.redirectUri}`,
        authority: `${environment.authority}`,
        postLogoutRedirectUri: `${environment.postLogoutUrl}`,

    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE,
    }
    
}


export const protectedResources = {
   
        endpoint:`${environment.apiUrl}`,
        scopes: [`${environment.scopes}`]
    
}


