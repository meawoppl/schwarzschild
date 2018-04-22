import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Stone } from './stone.model';
import { StonePopupService } from './stone-popup.service';
import { StoneService } from './stone.service';

@Component({
    selector: 'jhi-stone-dialog',
    templateUrl: './stone-dialog.component.html'
})
export class StoneDialogComponent implements OnInit {

    stone: Stone;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private stoneService: StoneService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.stone.id !== undefined) {
            this.subscribeToSaveResponse(
                this.stoneService.update(this.stone));
        } else {
            this.subscribeToSaveResponse(
                this.stoneService.create(this.stone));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Stone>>) {
        result.subscribe((res: HttpResponse<Stone>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Stone) {
        this.eventManager.broadcast({ name: 'stoneListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-stone-popup',
    template: ''
})
export class StonePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stonePopupService: StonePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.stonePopupService
                    .open(StoneDialogComponent as Component, params['id']);
            } else {
                this.stonePopupService
                    .open(StoneDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
