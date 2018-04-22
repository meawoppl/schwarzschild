import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Stone } from './stone.model';
import { StonePopupService } from './stone-popup.service';
import { StoneService } from './stone.service';

@Component({
    selector: 'jhi-stone-delete-dialog',
    templateUrl: './stone-delete-dialog.component.html'
})
export class StoneDeleteDialogComponent {

    stone: Stone;

    constructor(
        private stoneService: StoneService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.stoneService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'stoneListModification',
                content: 'Deleted an stone'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-stone-delete-popup',
    template: ''
})
export class StoneDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stonePopupService: StonePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.stonePopupService
                .open(StoneDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
