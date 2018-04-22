import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { EdgeComponent } from './edge.component';
import { EdgeDetailComponent } from './edge-detail.component';
import { EdgePopupComponent } from './edge-dialog.component';
import { EdgeDeletePopupComponent } from './edge-delete-dialog.component';

export const edgeRoute: Routes = [
    {
        path: 'edge',
        component: EdgeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Edges'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'edge/:id',
        component: EdgeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Edges'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const edgePopupRoute: Routes = [
    {
        path: 'edge-new',
        component: EdgePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Edges'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'edge/:id/edit',
        component: EdgePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Edges'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'edge/:id/delete',
        component: EdgeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Edges'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
