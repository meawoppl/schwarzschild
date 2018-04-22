/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SchwarzschildTestModule } from '../../../test.module';
import { StoneDetailComponent } from '../../../../../../main/webapp/app/entities/stone/stone-detail.component';
import { StoneService } from '../../../../../../main/webapp/app/entities/stone/stone.service';
import { Stone } from '../../../../../../main/webapp/app/entities/stone/stone.model';

describe('Component Tests', () => {

    describe('Stone Management Detail Component', () => {
        let comp: StoneDetailComponent;
        let fixture: ComponentFixture<StoneDetailComponent>;
        let service: StoneService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SchwarzschildTestModule],
                declarations: [StoneDetailComponent],
                providers: [
                    StoneService
                ]
            })
            .overrideTemplate(StoneDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StoneDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StoneService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Stone(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.stone).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
