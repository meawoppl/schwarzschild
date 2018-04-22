import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Linkage } from './linkage.model';
import { LinkagePopupService } from './linkage-popup.service';
import { LinkageService } from './linkage.service';

@Component({
    selector: 'jhi-linkage-delete-dialog',
    templateUrl: './linkage-delete-dialog.component.html'
})
export class LinkageDeleteDialogComponent {

    linkage: Linkage;

    constructor(
        private linkageService: LinkageService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.linkageService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'linkageListModification',
                content: 'Deleted an linkage'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-linkage-delete-popup',
    template: ''
})
export class LinkageDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private linkagePopupService: LinkagePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.linkagePopupService
                .open(LinkageDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
