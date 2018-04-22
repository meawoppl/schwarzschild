/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SchwarzschildTestModule } from '../../../test.module';
import { EdgeComponent } from '../../../../../../main/webapp/app/entities/edge/edge.component';
import { EdgeService } from '../../../../../../main/webapp/app/entities/edge/edge.service';
import { Edge } from '../../../../../../main/webapp/app/entities/edge/edge.model';

describe('Component Tests', () => {

    describe('Edge Management Component', () => {
        let comp: EdgeComponent;
        let fixture: ComponentFixture<EdgeComponent>;
        let service: EdgeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [EdgeComponent],
                providers: [
                    EdgeService
                ]
            })
            .overrideTemplate(EdgeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EdgeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EdgeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Edge(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.edges[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
