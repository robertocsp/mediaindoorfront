import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnunciosService {

    constructor(private http: HttpClient) {
    }

    get(q, page, limit) {
        let params = new HttpParams().set('_page', page).set('_limit', limit);
        if (q) {
            params = params.set('q', q);
        }
        return this.http.get<any>('/api/v1/ads', { params })
            .pipe(map(ads => {
                return ads;
            }));
    }

    getOne(adId) {
        return this.http.get<any>('/api/v1/ads/' + adId)
            .pipe(map(ads => {
                return ads;
            }));
    }

    add(formData) {
        return this.http.post<any>('/api/v1/ads/register', formData)
            .pipe(map(res => {
                console.log(res);
                return res;
            }));
    }

    update(adId, formData) {
        return this.http.put<any>('/api/v1/ads/' + adId, formData)
            .pipe(map(res => {
                console.log(res);
                return res;
            }));
    }

    delete(adId) {
        return this.http.delete<any>('/api/v1/ads/' + adId)
            .pipe(map(res => {
                console.log(res);
                return res;
            }));
    }
}