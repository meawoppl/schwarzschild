import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Stone } from './stone.model';
import { StoneService } from './stone.service';

@Injectable()
export class StonePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private stoneService: StoneService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.stoneService.find(id)
                    .subscribe((stoneResponse: HttpResponse<Stone>) => {
                        const stone: Stone = stoneResponse.body;
                        stone.creationTime = this.datePipe
                            .transform(stone.creationTime, 'yyyy-MM-ddTHH:mm:ss');
                        stone.completionTime = this.datePipe
                            .transform(stone.completionTime, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.stoneModalRef(component, stone);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.stoneModalRef(component, new Stone());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    stoneModalRef(component: Component, stone: Stone): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.stone = stone;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
