import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SchwarzschildStoneModule } from './stone/stone.module';
import { SchwarzschildEdgeModule } from './edge/edge.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        SchwarzschildStoneModule,
        SchwarzschildEdgeModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchwarzschildEntityModule {}
