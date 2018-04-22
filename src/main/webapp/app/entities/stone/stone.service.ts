import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Stone } from './stone.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Stone>;

@Injectable()
export class StoneService {

    private resourceUrl =  SERVER_API_URL + 'api/stones';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(stone: Stone): Observable<EntityResponseType> {
        const copy = this.convert(stone);
        return this.http.post<Stone>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(stone: Stone): Observable<EntityResponseType> {
        const copy = this.convert(stone);
        return this.http.put<Stone>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Stone>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Stone[]>> {
        const options = createRequestOption(req);
        return this.http.get<Stone[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Stone[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Stone = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Stone[]>): HttpResponse<Stone[]> {
        const jsonResponse: Stone[] = res.body;
        const body: Stone[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Stone.
     */
    private convertItemFromServer(stone: Stone): Stone {
        const copy: Stone = Object.assign({}, stone);
        copy.creationTime = this.dateUtils
            .convertDateTimeFromServer(stone.creationTime);
        copy.completionTime = this.dateUtils
            .convertDateTimeFromServer(stone.completionTime);
        return copy;
    }

    /**
     * Convert a Stone to a JSON which can be sent to the server.
     */
    private convert(stone: Stone): Stone {
        const copy: Stone = Object.assign({}, stone);

        copy.creationTime = this.dateUtils.toDate(stone.creationTime);

        copy.completionTime = this.dateUtils.toDate(stone.completionTime);
        return copy;
    }
}
