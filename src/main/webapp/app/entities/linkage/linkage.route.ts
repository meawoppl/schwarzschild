import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LinkageComponent } from './linkage.component';
import { LinkageDetailComponent } from './linkage-detail.component';
import { LinkagePopupComponent } from './linkage-dialog.component';
import { LinkageDeletePopupComponent } from './linkage-delete-dialog.component';

export const linkageRoute: Routes = [
    {
        path: 'linkage',
        component: LinkageComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.linkage.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'linkage/:id',
        component: LinkageDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.linkage.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const linkagePopupRoute: Routes = [
    {
        path: 'linkage-new',
        component: LinkagePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.linkage.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'linkage/:id/edit',
        component: LinkagePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.linkage.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'linkage/:id/delete',
        component: LinkageDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'schwarzschildApp.linkage.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
