import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService, GruposService } from '../../_services';
import { of } from 'rxjs';
import { switchMap, catchError, first } from 'rxjs/operators';

@Component({
    selector: 'app-grupos-listar',
    templateUrl: './grupos-listar.component.html',
})
export class GruposListarComponent implements OnInit {
    currentUser: any;
    groups$: any;
    private loading: boolean = false;
    heading = 'Grupos';
    icon = 'pe-7s-culture icon-gradient bg-mean-fruit';
    page = 1;
    collectionSize = 0;
    limit = 1;

    ngOnInit() {
        this.getGroups(null);
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private gruposService: GruposService
    ) {
        this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    }

    doSearch(q: string, page) {
        this.loading = true;
        return this.gruposService.get(q, page, this.limit);
    }

    onSearch(q: string, page) {
        this.router.navigate(["/arealogada/grupos/listar", { q: q, page: page }]);
    }

    deleteGroup(groupId) {
        this.gruposService.delete(groupId)
            .pipe(first())
            .subscribe(
                () => {
                    this.getGroups(null);
                },
                error => {
                    //this.error = error;
                    console.error(error);
                    this.loading = false;
                });
    }

    getGroups(page) {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.doSearch(params.get('q'), page ? page : params.get('page') ? params.get('page') : 1)
            ), catchError(err => {
                console.error(err);
                return of([]);
            })).subscribe(groups => {
                this.groups$ = groups.groups;
                this.collectionSize = groups.groupsCount;
            });
    }
}
