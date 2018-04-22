import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Linkage } from './linkage.model';
import { LinkagePopupService } from './linkage-popup.service';
import { LinkageService } from './linkage.service';
import { Stone, StoneService } from '../stone';

@Component({
    selector: 'jhi-linkage-dialog',
    templateUrl: './linkage-dialog.component.html'
})
export class LinkageDialogComponent implements OnInit {

    linkage: Linkage;
    isSaving: boolean;

    dependees: Stone[];

    dependants: Stone[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private linkageService: LinkageService,
        private stoneService: StoneService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.stoneService
            .query({filter: 'linkage-is-null'})
            .subscribe((res: HttpResponse<Stone[]>) => {
                if (!this.linkage.dependee || !this.linkage.dependee.id) {
                    this.dependees = res.body;
                } else {
                    this.stoneService
                        .find(this.linkage.dependee.id)
                        .subscribe((subRes: HttpResponse<Stone>) => {
                            this.dependees = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.stoneService
            .query({filter: 'linkage-is-null'})
            .subscribe((res: HttpResponse<Stone[]>) => {
                if (!this.linkage.dependant || !this.linkage.dependant.id) {
                    this.dependants = res.body;
                } else {
                    this.stoneService
                        .find(this.linkage.dependant.id)
                        .subscribe((subRes: HttpResponse<Stone>) => {
                            this.dependants = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.linkage.id !== undefined) {
            this.subscribeToSaveResponse(
                this.linkageService.update(this.linkage));
        } else {
            this.subscribeToSaveResponse(
                this.linkageService.create(this.linkage));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Linkage>>) {
        result.subscribe((res: HttpResponse<Linkage>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Linkage) {
        this.eventManager.broadcast({ name: 'linkageListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackStoneById(index: number, item: Stone) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-linkage-popup',
    template: ''
})
export class LinkagePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private linkagePopupService: LinkagePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.linkagePopupService
                    .open(LinkageDialogComponent as Component, params['id']);
            } else {
                this.linkagePopupService
                    .open(LinkageDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
