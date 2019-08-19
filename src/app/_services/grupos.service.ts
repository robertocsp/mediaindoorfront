import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GruposService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<any>('/api/v1/groups')
            .pipe(map(groups => {
                console.log(groups);
                return groups;
            }));
    }

    get(q, page, limit) {
        let params = new HttpParams().set('_page', page).set('_limit', limit);
        if (q) {
            params = params.set('q', q);
        }
        return this.http.get<any>('/api/v1/groups', { params })
            .pipe(map(groups => {
                return groups;
            }));
    }

    getOne(groupId) {
        return this.http.get<any>('/api/v1/groups/' + groupId)
            .pipe(map(group => {
                return group;
            }));
    }

    add(formData) {
        return this.http.post<any>('/api/v1/groups/register', formData)
            .pipe(map(res => {
                console.log(res);
                return res;
            }));
    }

    update(adId, formData) {
        return this.http.put<any>('/api/v1/groups/' + adId, formData)
            .pipe(map(res => {
                console.log(res);
                return res;
            }));
    }

    delete(adId) {
        return this.http.delete<any>('/api/v1/groups/' + adId)
            .pipe(map(res => {
                console.log(res);
                return res;
            }));
    }
}