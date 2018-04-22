/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SchwarzschildTestModule } from '../../../test.module';
import { LinkageComponent } from '../../../../../../main/webapp/app/entities/linkage/linkage.component';
import { LinkageService } from '../../../../../../main/webapp/app/entities/linkage/linkage.service';
import { Linkage } from '../../../../../../main/webapp/app/entities/linkage/linkage.model';

describe('Component Tests', () => {

    describe('Linkage Management Component', () => {
        let comp: LinkageComponent;
        let fixture: ComponentFixture<LinkageComponent>;
        let service: LinkageService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [LinkageComponent],
                providers: [
                    LinkageService
                ]
            })
            .overrideTemplate(LinkageComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LinkageComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LinkageService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Linkage(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.linkages[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
