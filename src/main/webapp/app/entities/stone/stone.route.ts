import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { StoneComponent } from './stone.component';
import { StoneDetailComponent } from './stone-detail.component';
import { StonePopupComponent } from './stone-dialog.component';
import { StoneDeletePopupComponent } from './stone-delete-dialog.component';

export const stoneRoute: Routes = [
    {
        path: 'stone',
        component: StoneComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.stone.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'stone/:id',
        component: StoneDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.stone.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const stonePopupRoute: Routes = [
    {
        path: 'stone-new',
        component: StonePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.stone.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'stone/:id/edit',
        component: StonePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.stone.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'stone/:id/delete',
        component: StoneDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.stone.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
