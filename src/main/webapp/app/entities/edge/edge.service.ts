import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Edge } from './edge.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Edge>;

@Injectable()
export class EdgeService {

    private resourceUrl =  SERVER_API_URL + 'api/edges';

    constructor(private http: HttpClient) { }

    create(edge: Edge): Observable<EntityResponseType> {
        const copy = this.convert(edge);
        return this.http.post<Edge>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(edge: Edge): Observable<EntityResponseType> {
        const copy = this.convert(edge);
        return this.http.put<Edge>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Edge>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Edge[]>> {
        const options = createRequestOption(req);
        return this.http.get<Edge[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Edge[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Edge = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Edge[]>): HttpResponse<Edge[]> {
        const jsonResponse: Edge[] = res.body;
        const body: Edge[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Edge.
     */
    private convertItemFromServer(edge: Edge): Edge {
        const copy: Edge = Object.assign({}, edge);
        return copy;
    }

    /**
     * Convert a Edge to a JSON which can be sent to the server.
     */
    private convert(edge: Edge): Edge {
        const copy: Edge = Object.assign({}, edge);
        return copy;
    }
}
