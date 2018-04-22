import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Linkage } from './linkage.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Linkage>;

@Injectable()
export class LinkageService {

    private resourceUrl =  SERVER_API_URL + 'api/linkages';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(linkage: Linkage): Observable<EntityResponseType> {
        const copy = this.convert(linkage);
        return this.http.post<Linkage>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(linkage: Linkage): Observable<EntityResponseType> {
        const copy = this.convert(linkage);
        return this.http.put<Linkage>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Linkage>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Linkage[]>> {
        const options = createRequestOption(req);
        return this.http.get<Linkage[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Linkage[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Linkage = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Linkage[]>): HttpResponse<Linkage[]> {
        const jsonResponse: Linkage[] = res.body;
        const body: Linkage[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Linkage.
     */
    private convertItemFromServer(linkage: Linkage): Linkage {
        const copy: Linkage = Object.assign({}, linkage);
        copy.creationTime = this.dateUtils
            .convertDateTimeFromServer(linkage.creationTime);
        return copy;
    }

    /**
     * Convert a Linkage to a JSON which can be sent to the server.
     */
    private convert(linkage: Linkage): Linkage {
        const copy: Linkage = Object.assign({}, linkage);

        copy.creationTime = this.dateUtils.toDate(linkage.creationTime);
        return copy;
    }
}
