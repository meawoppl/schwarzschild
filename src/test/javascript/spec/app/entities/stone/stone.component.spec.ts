/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SchwarzschildTestModule } from '../../../test.module';
import { StoneComponent } from '../../../../../../main/webapp/app/entities/stone/stone.component';
import { StoneService } from '../../../../../../main/webapp/app/entities/stone/stone.service';
import { Stone } from '../../../../../../main/webapp/app/entities/stone/stone.model';

describe('Component Tests', () => {

    describe('Stone Management Component', () => {
        let comp: StoneComponent;
        let fixture: ComponentFixture<StoneComponent>;
        let service: StoneService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [StoneComponent],
                providers: [
                    StoneService
                ]
            })
            .overrideTemplate(StoneComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StoneComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StoneService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Stone(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.stones[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
