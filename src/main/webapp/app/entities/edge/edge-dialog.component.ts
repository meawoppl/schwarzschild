import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Edge } from './edge.model';
import { EdgePopupService } from './edge-popup.service';
import { EdgeService } from './edge.service';
import { Stone, StoneService } from '../stone';

@Component({
    selector: 'jhi-edge-dialog',
    templateUrl: './edge-dialog.component.html'
})
export class EdgeDialogComponent implements OnInit {

    edge: Edge;
    isSaving: boolean;

    froms: Stone[];

    tos: Stone[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private edgeService: EdgeService,
        private stoneService: StoneService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.stoneService
            .query({filter: 'edge-is-null'})
            .subscribe((res: HttpResponse<Stone[]>) => {
                if (!this.edge.from || !this.edge.from.id) {
                    this.froms = res.body;
                } else {
                    this.stoneService
                        .find(this.edge.from.id)
                        .subscribe((subRes: HttpResponse<Stone>) => {
                            this.froms = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.stoneService
            .query({filter: 'edge-is-null'})
            .subscribe((res: HttpResponse<Stone[]>) => {
                if (!this.edge.to || !this.edge.to.id) {
                    this.tos = res.body;
                } else {
                    this.stoneService
                        .find(this.edge.to.id)
                        .subscribe((subRes: HttpResponse<Stone>) => {
                            this.tos = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.edge.id !== undefined) {
            this.subscribeToSaveResponse(
                this.edgeService.update(this.edge));
        } else {
            this.subscribeToSaveResponse(
                this.edgeService.create(this.edge));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Edge>>) {
        result.subscribe((res: HttpResponse<Edge>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Edge) {
        this.eventManager.broadcast({ name: 'edgeListModification', content: 'OK'});
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
    selector: 'jhi-edge-popup',
    template: ''
})
export class EdgePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private edgePopupService: EdgePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.edgePopupService
                    .open(EdgeDialogComponent as Component, params['id']);
            } else {
                this.edgePopupService
                    .open(EdgeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
