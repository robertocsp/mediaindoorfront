import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlacesService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<any>('/api/v1/places')
            .pipe(map(places => {
                return places;
            }));
    }

    getByGroup(groupId) {
        return this.http.get<any>('/api/v1/places/group/' + groupId)
            .pipe(map(places => {
                return places;
            }));
    }

    getByNotInGroup(groupId) {
        return this.http.get<any>('/api/v1/places/nigroup/' + groupId)
            .pipe(map(places => {
                return places;
            }));
    }
}