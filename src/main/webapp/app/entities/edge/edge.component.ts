import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Edge } from './edge.model';
import { EdgeService } from './edge.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-edge',
    templateUrl: './edge.component.html'
})
export class EdgeComponent implements OnInit, OnDestroy {
edges: Edge[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private edgeService: EdgeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.edgeService.query().subscribe(
            (res: HttpResponse<Edge[]>) => {
                this.edges = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInEdges();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Edge) {
        return item.id;
    }
    registerChangeInEdges() {
        this.eventSubscriber = this.eventManager.subscribe('edgeListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
