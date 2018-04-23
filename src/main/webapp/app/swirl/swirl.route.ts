import { Route } from '@angular/router';

import { SwirlComponent } from './';

export const SWIRL_ROUTE: Route = {
    path: 'swirl',
    component: SwirlComponent,
    data: {
        authorities: [],
        pageTitle: 'Welcome, Java Hipster!'
    }
};
