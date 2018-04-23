import { Component, AfterViewInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { ThreeForceGraph } from 'three-forcegraph';

@Component({
    selector: 'jhi-swirl',
    templateUrl: './swirl.component.html',
    styleUrls: [
        'swirl.scss'
    ]

})
export class SwirlComponent implements AfterViewInit {
    account: Account;
    modalRef: NgbModalRef;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
      ) { }

    ngAfterViewInit() {
        // const graph = ForceGraph3D();
        // graph(document.getElementById('3d-graph'));

        console.log('I AM ALIVE');
        console.log(ThreeForceGraph);
        console.log(ThreeForceGraph());
        // console.log(graph);
    }

}
