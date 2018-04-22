/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SchwarzschildTestModule } from '../../../test.module';
import { LinkageDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/linkage/linkage-delete-dialog.component';
import { LinkageService } from '../../../../../../main/webapp/app/entities/linkage/linkage.service';

describe('Component Tests', () => {

    describe('Linkage Management Delete Component', () => {
        let comp: LinkageDeleteDialogComponent;
        let fixture: ComponentFixture<LinkageDeleteDialogComponent>;
        let service: LinkageService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [LinkageDeleteDialogComponent],
                providers: [
                    LinkageService
                ]
            })
            .overrideTemplate(LinkageDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LinkageDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LinkageService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
