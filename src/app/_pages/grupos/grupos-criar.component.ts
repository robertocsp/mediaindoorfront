import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService, GruposService } from '../../_services';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { SelectEventArgs, RemoveEventArgs } from '@syncfusion/ej2-dropdowns';

@Component({
    selector: 'app-grupos-criar',
    templateUrl: './grupos-criar-editar.component.html'
})
export class GruposCriarComponent implements OnInit {
    currentUser: any;
    heading = 'Criar Grupo';
    icon = 'pe-7s-culture icon-gradient bg-mean-fruit';
    loading = false;
    submitted = false;
    grupoForm: FormGroup;
    usersList: FormArray;
    users$: Observable<any>;
    public userFields: Object = { text: 'username', value: '_id' };
    public userWaterMark: string = 'Buscar Usuário';
    public userSearchWaterMark: string = 'Busca Usuário';
    private usersAddedToView: string[] = [];

    ngOnInit() {
        this.grupoForm = this.formBuilder.group({
            groupname: ['', Validators.required],
            users: this.formBuilder.array([])
        });

        // set contactlist to this field
        this.usersList = this.grupoForm.get('users') as FormArray;
        this.users$ = this.usersService.getByNotIn('current').pipe(map(users => users));
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private gruposService: GruposService,
        private usersService: UsersService
    ) {
        this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    }

    // convenience getter for easy access to form fields
    get f() { return this.grupoForm.controls; }

    // returns all form groups under users
    get userFormGroup() {
        return this.grupoForm.get('users') as FormArray;
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
        this.usersList.push(this.createUser(user['_id']));
        this.usersAddedToView.push(user['username']);
    }

    // remove user from group
    removeUser(index, isSelf) {
        this.usersList.removeAt(index);
        this.usersAddedToView.splice(index, 1);
        if(isSelf) {
            let usersMultiSelect = document.getElementsByTagName('ejs-multiselect')[0]['ej2_instances'][0];
            let selectedUsers = usersMultiSelect.value;
            selectedUsers.splice(index, 1);
            usersMultiSelect.value = selectedUsers.length ? selectedUsers : null;
        }
    }

    // get the formgroup under users form array
    getUsersFormGroup(index): FormGroup {
        const formGroup = this.usersList.controls[index] as FormGroup;
        return formGroup;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.grupoForm.invalid) {
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
        const index = this.usersAddedToView.findIndex(username => {
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
