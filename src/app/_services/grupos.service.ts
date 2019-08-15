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
}