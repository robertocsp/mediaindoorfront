import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class MediaIndoorService {
    private socket: any;
    private place: any;

    constructor() {
        console.log('service constructor :: env :: ' + environment.production);
        this.socket = io.connect(environment.socketiourl);
    }

    onConnect(place) {
        this.place = place;
        console.log('service on connect ::: ' + this.place);
        this.socket.on('connect', () => {
            console.log('connected socket id ::: ' + this.socket.id);
            console.log('place id ::: ' + this.place);
            this.joinPlace(this.place);
        });
    }

    getAds() {
        return Observable.create((observer) => {
            this.socket.on('ads-message', (data) => {
                if (data) {
                    observer.next(data);
                } else {
                    observer.error('Nenhum dado retornado.');
                }
            });
            return () => {
                this.socket.disconnect();
            };
        });
    }

    joinPlace(channel) {
        this.socket.emit('joinPlace', channel);
    }
}