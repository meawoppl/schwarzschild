/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SchwarzschildTestModule } from '../../../test.module';
import { LinkageDetailComponent } from '../../../../../../main/webapp/app/entities/linkage/linkage-detail.component';
import { LinkageService } from '../../../../../../main/webapp/app/entities/linkage/linkage.service';
import { Linkage } from '../../../../../../main/webapp/app/entities/linkage/linkage.model';

describe('Component Tests', () => {

    describe('Linkage Management Detail Component', () => {
        let comp: LinkageDetailComponent;
        let fixture: ComponentFixture<LinkageDetailComponent>;
        let service: LinkageService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [LinkageDetailComponent],
                providers: [
                    LinkageService
                ]
            })
            .overrideTemplate(LinkageDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LinkageDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LinkageService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Linkage(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.linkage).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
