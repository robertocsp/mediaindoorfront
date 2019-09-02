import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService, GruposService, PlacesService } from '../../_services';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { SelectEventArgs, RemoveEventArgs } from '@syncfusion/ej2-dropdowns';

@Component({
    selector: 'app-usuarios-criar',
    templateUrl: './usuarios-criar-editar.component.html'
})
export class UsuariosCriarComponent implements OnInit {
    currentUser: any;
    heading = 'Criar Usuário';
    icon = 'pe-7s-add-user icon-gradient bg-mean-fruit';
    loading = false;
    submitted = false;
    usuarioForm: FormGroup;
    groupsList: FormArray;
    groups$: Observable<any>;
    public groupFields: Object = { text: 'groupname', value: '_id' };
    public groupWaterMark: string = 'Buscar Grupo';
    private groupsAddedToView: string[] = [];
    placesList: FormArray;
    places$: Observable<any>;
    public placeFields: Object = { text: 'placename', value: '_id' };
    public placeWaterMark: string = 'Buscar Local';
    private placesAddedToView: string[] = [];
    error: string;

    ngOnInit() {
        this.usuarioForm = this.formBuilder.group({
            username: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            isSU: [false],
            groups: this.formBuilder.array([]),
            places: this.formBuilder.array([])
        });

        this.groupsList = this.usuarioForm.get('groups') as FormArray;
        this.groups$ = this.gruposService.getAll().pipe(map(groups => groups));
        this.placesList = this.usuarioForm.get('places') as FormArray;
        this.places$ = this.placesService.getAll().pipe(map(places => places));
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private gruposService: GruposService,
        private placesService: PlacesService,
        private usersService: UsersService
    ) {
        this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    }

    // convenience getter for easy access to form fields
    get f() { return this.usuarioForm.controls; }

    // returns all form groups under users
    get userFormGroup() {
        return this.usuarioForm.get('users') as FormArray;
    }

    // user formgroup
    createUser(user): FormGroup {
        return this.formBuilder.group({
            user: [user, Validators.compose([Validators.required])],
            role: [null, Validators.compose([Validators.required])]
        });
    }

    // add a user form group
    addUser(user) {
        this.groupsList.push(this.createUser(user['_id']));
        this.groupsAddedToView.push(user['username']);
    }

    // remove user from group
    removeUser(index, isSelf) {
        this.groupsList.removeAt(index);
        this.groupsAddedToView.splice(index, 1);
        if(isSelf) {
            let usersMultiSelect = document.getElementsByTagName('ejs-multiselect')[0]['ej2_instances'][0];
            let selectedUsers = usersMultiSelect.value;
            selectedUsers.splice(index, 1);
            usersMultiSelect.value = selectedUsers.length ? selectedUsers : null;
        }
    }

    // get the formgroup under users form array
    getUsersFormGroup(index): FormGroup {
        const formGroup = this.groupsList.controls[index] as FormGroup;
        return formGroup;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.usuarioForm.invalid) {
            return;
        }

        this.loading = true;

        if (this.f.users.value) {
            this.f.users.value.map(function (elem) {
                if(Array.isArray(elem.user))
                    elem.user = elem.user[0];
            });
        }

        this.gruposService.add({
            groupname: this.f.groupname.value,
            users: this.f.users.value
        })
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['arealogada/grupos/listar']);
                },
                error => {
                    console.error(error);
                    this.loading = false;
                });
    }

    userSelected(args: SelectEventArgs) {
        this.addUser(args['itemData']);
    }

    userRemoved(args: RemoveEventArgs) {
        const index = this.groupsAddedToView.findIndex(username => {
            return username === args['itemData']['username'];
        });
        if (index >= 0) {
            this.removeUser(index, false);
        }
    }

    componentCreated(args: Object) {
        // NADA A FAZER.
    }
}
