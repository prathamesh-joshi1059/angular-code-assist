// AI confidence score for this refactoring: 68.86%
export class Settings {
    constructor(
        public name: string, 
        public loadingSpinner: boolean,
        public fixedHeader: boolean,
        public fixedSidenav: boolean, 
        public fixedFooter: boolean,
        public sidenavIsOpened: boolean,
        public sidenavIsPinned: boolean,
        public menu: string,
        public menuType: string,
        public theme: string,
        public rtl: boolean
    ) {}
}

/*
- Constructor parameters should be formatted consistently, preferably with type annotations on their own line.
- Inconsistent spacing around parameters can reduce readability.
- Public visibility modifier should be used consistently.
*/