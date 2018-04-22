import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Stone } from './stone.model';
import { StoneService } from './stone.service';

@Component({
    selector: 'jhi-stone-detail',
    templateUrl: './stone-detail.component.html'
})
export class StoneDetailComponent implements OnInit, OnDestroy {

    stone: Stone;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private stoneService: StoneService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInStones();
    }

    load(id) {
        this.stoneService.find(id)
            .subscribe((stoneResponse: HttpResponse<Stone>) => {
                this.stone = stoneResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInStones() {
        this.eventSubscriber = this.eventManager.subscribe(
            'stoneListModification',
            (response) => this.load(this.stone.id)
        );
    }
}
