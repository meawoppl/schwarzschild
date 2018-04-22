/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SchwarzschildTestModule } from '../../../test.module';
import { EdgeDetailComponent } from '../../../../../../main/webapp/app/entities/edge/edge-detail.component';
import { EdgeService } from '../../../../../../main/webapp/app/entities/edge/edge.service';
import { Edge } from '../../../../../../main/webapp/app/entities/edge/edge.model';

describe('Component Tests', () => {

    describe('Edge Management Detail Component', () => {
        let comp: EdgeDetailComponent;
        let fixture: ComponentFixture<EdgeDetailComponent>;
        let service: EdgeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [EdgeDetailComponent],
                providers: [
                    EdgeService
                ]
            })
            .overrideTemplate(EdgeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EdgeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EdgeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Edge(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.edge).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
