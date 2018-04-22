import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchwarzschildSharedModule } from '../../shared';
import {
    LinkageService,
    LinkagePopupService,
    LinkageComponent,
    LinkageDetailComponent,
    LinkageDialogComponent,
    LinkagePopupComponent,
    LinkageDeletePopupComponent,
    LinkageDeleteDialogComponent,
    linkageRoute,
    linkagePopupRoute,
} from './';

const ENTITY_STATES = [
    ...linkageRoute,
    ...linkagePopupRoute,
];

@NgModule({
    imports: [
        SchwarzschildSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LinkageComponent,
        LinkageDetailComponent,
        LinkageDialogComponent,
        LinkageDeleteDialogComponent,
        LinkagePopupComponent,
        LinkageDeletePopupComponent,
    ],
    entryComponents: [
        LinkageComponent,
        LinkageDialogComponent,
        LinkagePopupComponent,
        LinkageDeleteDialogComponent,
        LinkageDeletePopupComponent,
    ],
    providers: [
        LinkageService,
        LinkagePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchwarzschildLinkageModule {}
