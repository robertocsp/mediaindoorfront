import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<any>('/api/v1/users')
            .pipe(map(users => {
                return users;
            }));
    }

    get(q, page, limit) {
        let params = new HttpParams().set('_page', page).set('_limit', limit);
        if (q) {
            params = params.set('q', q);
        }
        return this.http.get<any>('/api/v1/users', { params })
            .pipe(map(users => {
                return users;
            }));
    }

    getByNotIn(users) {
        return this.http.get<any>('/api/v1/users?ni=' + users)
            .pipe(map(users => {
                return users;
            }));
    }

    delete(userId) {
        return this.http.delete<any>('/api/v1/users/' + userId)
            .pipe(map(res => {
                return res;
            }));
    }
}