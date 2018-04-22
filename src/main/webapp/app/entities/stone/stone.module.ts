import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchwarzschildSharedModule } from '../../shared';
import {
    StoneService,
    StonePopupService,
    StoneComponent,
    StoneDetailComponent,
    StoneDialogComponent,
    StonePopupComponent,
    StoneDeletePopupComponent,
    StoneDeleteDialogComponent,
    stoneRoute,
    stonePopupRoute,
} from './';

const ENTITY_STATES = [
    ...stoneRoute,
    ...stonePopupRoute,
];

@NgModule({
    imports: [
        SchwarzschildSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        StoneComponent,
        StoneDetailComponent,
        StoneDialogComponent,
        StoneDeleteDialogComponent,
        StonePopupComponent,
        StoneDeletePopupComponent,
    ],
    entryComponents: [
        StoneComponent,
        StoneDialogComponent,
        StonePopupComponent,
        StoneDeleteDialogComponent,
        StoneDeletePopupComponent,
    ],
    providers: [
        StoneService,
        StonePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchwarzschildStoneModule {}
