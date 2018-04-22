import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Stone } from './stone.model';
import { StoneService } from './stone.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-stone',
    templateUrl: './stone.component.html'
})
export class StoneComponent implements OnInit, OnDestroy {
stones: Stone[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private stoneService: StoneService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.stoneService.query().subscribe(
            (res: HttpResponse<Stone[]>) => {
                this.stones = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInStones();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Stone) {
        return item.id;
    }
    registerChangeInStones() {
        this.eventSubscriber = this.eventManager.subscribe('stoneListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
