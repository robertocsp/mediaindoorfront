import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService } from '../../_services';
import { of } from 'rxjs';
import { switchMap, catchError, first } from 'rxjs/operators';
import { UsersService } from 'src/app/_services/users.service';

@Component({
    selector: 'app-usuarios-listar',
    templateUrl: './usuarios-listar.component.html',
})
export class UsuariosListarComponent implements OnInit {
    currentUser: any;
    users$: any;
    private loading: boolean = false;
    heading = 'Usuários';
    icon = 'pe-7s-users icon-gradient bg-mean-fruit';
    page = 1;
    collectionSize = 0;
    limit = 100;

    ngOnInit() {
        this.getUsers(null);
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private usuariosService: UsersService
    ) {
        this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    }

    doSearch(q: string, page) {
        this.loading = true;
        return this.usuariosService.get(q, page, this.limit);
    }

    onSearch(q: string, page) {
        this.router.navigate(["/arealogada/usuarios/listar", { q: q, page: page }]);
    }

    deleteUser(userId) {
        this.usuariosService.delete(userId)
            .pipe(first())
            .subscribe(
                () => {
                    this.getUsers(null);
                },
                error => {
                    console.error(error);
                    this.loading = false;
                });
    }

    getUsers(page) {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.doSearch(params.get('q'), page ? page : params.get('page') ? params.get('page') : 1)
            ), catchError(err => {
                console.error(err);
                return of([]);
            })).subscribe(users => {
                this.users$ = users.users;
                this.collectionSize = users.usersCount;
            });
    }
}
