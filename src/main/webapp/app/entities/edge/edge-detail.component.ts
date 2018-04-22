import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Edge } from './edge.model';
import { EdgeService } from './edge.service';

@Component({
    selector: 'jhi-edge-detail',
    templateUrl: './edge-detail.component.html'
})
export class EdgeDetailComponent implements OnInit, OnDestroy {

    edge: Edge;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private edgeService: EdgeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEdges();
    }

    load(id) {
        this.edgeService.find(id)
            .subscribe((edgeResponse: HttpResponse<Edge>) => {
                this.edge = edgeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEdges() {
        this.eventSubscriber = this.eventManager.subscribe(
            'edgeListModification',
            (response) => this.load(this.edge.id)
        );
    }
}
