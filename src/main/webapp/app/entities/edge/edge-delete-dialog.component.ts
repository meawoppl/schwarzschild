import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Edge } from './edge.model';
import { EdgePopupService } from './edge-popup.service';
import { EdgeService } from './edge.service';

@Component({
    selector: 'jhi-edge-delete-dialog',
    templateUrl: './edge-delete-dialog.component.html'
})
export class EdgeDeleteDialogComponent {

    edge: Edge;

    constructor(
        private edgeService: EdgeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.edgeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'edgeListModification',
                content: 'Deleted an edge'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-edge-delete-popup',
    template: ''
})
export class EdgeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private edgePopupService: EdgePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.edgePopupService
                .open(EdgeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
