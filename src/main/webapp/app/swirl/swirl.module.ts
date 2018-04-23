import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchwarzschildSharedModule } from '../shared';
import { ForceGraph3D } from '3d-force-graph';

import { SWIRL_ROUTE, SwirlComponent } from './';

@NgModule({
    imports: [
        SchwarzschildSharedModule,
        RouterModule.forChild([ SWIRL_ROUTE ])
    ],
    declarations: [
        SwirlComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchwarzschildSwirlModule {}
