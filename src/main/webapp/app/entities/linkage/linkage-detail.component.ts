import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Linkage } from './linkage.model';
import { LinkageService } from './linkage.service';

@Component({
    selector: 'jhi-linkage-detail',
    templateUrl: './linkage-detail.component.html'
})
export class LinkageDetailComponent implements OnInit, OnDestroy {

    linkage: Linkage;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private linkageService: LinkageService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLinkages();
    }

    load(id) {
        this.linkageService.find(id)
            .subscribe((linkageResponse: HttpResponse<Linkage>) => {
                this.linkage = linkageResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLinkages() {
        this.eventSubscriber = this.eventManager.subscribe(
            'linkageListModification',
            (response) => this.load(this.linkage.id)
        );
    }
}
