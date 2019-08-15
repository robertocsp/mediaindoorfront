import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TagsService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<any>('/api/v1/tags')
            .pipe(map(tags => {
                console.log(tags);
                return tags;
            }));
    }
}