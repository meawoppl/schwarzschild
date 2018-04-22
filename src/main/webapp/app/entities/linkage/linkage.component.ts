import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Linkage } from './linkage.model';
import { LinkageService } from './linkage.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-linkage',
    templateUrl: './linkage.component.html'
})
export class LinkageComponent implements OnInit, OnDestroy {
linkages: Linkage[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private linkageService: LinkageService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.linkageService.query().subscribe(
            (res: HttpResponse<Linkage[]>) => {
                this.linkages = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLinkages();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Linkage) {
        return item.id;
    }
    registerChangeInLinkages() {
        this.eventSubscriber = this.eventManager.subscribe('linkageListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
