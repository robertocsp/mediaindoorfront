import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService, AnunciosService } from '../../_services';
import { of } from 'rxjs';
import { switchMap, catchError, first, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-anuncios-listar',
    templateUrl: './anuncios-listar.component.html',
    styles: ['.media-img { position: inherit; max-width: 100%; max-height: 100%; }']
})
export class AnunciosListarComponent implements OnInit {
    currentUser: any;
    ads$: any;
    private loading: boolean = false;
    heading = 'Anúncios';
    icon = 'pe-7s-monitor icon-gradient bg-mean-fruit';
    page = 1;
    collectionSize = 0;
    limit = 100;

    ngOnInit() {
        this.getAds(null);
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private anunciosService: AnunciosService,
        private modalService: NgbModal
    ) {
        this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    }

    doSearch(q: string, page) {
        this.loading = true;
        return this.anunciosService.get(q, page, this.limit);
    }

    onSearch(q: string, page) {
        this.router.navigate(["/arealogada/anuncios/listar", { q: q, page: page }]);
    }

    deleteAd(adId) {
        this.anunciosService.delete(adId)
            .pipe(first())
            .subscribe(
                () => {
                    this.getAds(null);
                },
                error => {
                    //this.error = error;
                    console.error(error);
                    this.loading = false;
                });
    }

    getAds(page) {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.doSearch(params.get('q'), page ? page : params.get('page') ? params.get('page') : 1)
            ), catchError(err => {
                console.error(err);
                return of([]);
            })).subscribe(ads => {
                this.ads$ = ads.ads;
                this.collectionSize = ads.adsCount;
            });
    }

    objectArrayToString(objArray, propertyToPrint) {
        return Array.prototype.map.call(objArray, function(item) { return item[propertyToPrint]; }).join(", ")
    }

    openLarge(content) {
        this.modalService.open(content, {
            size: 'lg'
        });
    }
}
