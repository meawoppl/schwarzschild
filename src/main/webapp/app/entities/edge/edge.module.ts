import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchwarzschildSharedModule } from '../../shared';
import {
    EdgeService,
    EdgePopupService,
    EdgeComponent,
    EdgeDetailComponent,
    EdgeDialogComponent,
    EdgePopupComponent,
    EdgeDeletePopupComponent,
    EdgeDeleteDialogComponent,
    edgeRoute,
    edgePopupRoute,
} from './';

const ENTITY_STATES = [
    ...edgeRoute,
    ...edgePopupRoute,
];

@NgModule({
    imports: [
        SchwarzschildSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EdgeComponent,
        EdgeDetailComponent,
        EdgeDialogComponent,
        EdgeDeleteDialogComponent,
        EdgePopupComponent,
        EdgeDeletePopupComponent,
    ],
    entryComponents: [
        EdgeComponent,
        EdgeDialogComponent,
        EdgePopupComponent,
        EdgeDeleteDialogComponent,
        EdgeDeletePopupComponent,
    ],
    providers: [
        EdgeService,
        EdgePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchwarzschildEdgeModule {}
