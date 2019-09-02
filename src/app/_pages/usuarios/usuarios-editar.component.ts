import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService, GruposService } from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { UsersService } from 'src/app/_services/users.service';
import { SelectEventArgs } from '@syncfusion/ej2-lists';
import { RemoveEventArgs } from '@syncfusion/ej2-dropdowns';

@Component({
    selector: 'app-usuarios-editar',
    templateUrl: './usuarios-criar-editar.component.html',
    styles: ['.media-img { position: inherit; max-width: 100%; max-height: 100%; }']
})
export class UsuariosEditarComponent implements OnInit {
    _id: any;
    currentUser: any;
    heading = 'Editar Usuário';
    icon = 'pe-7s-user-female icon-gradient bg-mean-fruit';
    loading = false;
    submitted = false;
    usuarioForm: FormGroup;
    usersList: FormArray;
    users$: Observable<any>;
    public userFields: Object = { text: 'username', value: '_id' };
    public userWaterMark: string = 'Buscar Usuário';
    public userSearchWaterMark: string = 'Busca Usuário';
    private usersAddedToView: string[] = [];
    error: string;

    ngOnInit() {
        this.usuarioForm = this.formBuilder.group({
            groupname: ['', Validators.required],
            users: this.formBuilder.array([])
        });

        // set userslist to this field
        this.usersList = this.usuarioForm.get('users') as FormArray;
        this.users$ = this.usersService.getByNotIn('current').pipe(map(users => users));
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private gruposService: GruposService,
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
    createUser(userObject): FormGroup {
        return this.formBuilder.group({
            user: [userObject ? [userObject.user._id] : null, Validators.compose([Validators.required])],
            role: [userObject ? userObject.role : null, Validators.compose([Validators.required])]
        });
    }

    // add a user form group
    addUser(user) {
        this.usersList.push(this.createUser(user));
        this.usersAddedToView.push(user['user']['username']);
    }

    // remove contact from group
    removeUser(index, isSelf) {
        this.usersList.removeAt(index);
        this.usersAddedToView.splice(index, 1);
        if(isSelf) {
            let usersMultiSelect = document.getElementsByTagName('ejs-multiselect')[0]['ej2_instances'][0];
            let selectedUsers = usersMultiSelect.value;
            console.log(selectedUsers.splice(index, 1));
            usersMultiSelect.value = selectedUsers.length ? selectedUsers : null;
        }
    }

    // get the formgroup under users form array
    getUsersFormGroup(index): FormGroup {
        const formGroup = this.usersList.controls[index] as FormGroup;
        return formGroup;
    }

    getGroup(groupId) {
        this.gruposService.getOne(groupId).subscribe(data => {
            this._id = data._id;
            this.usuarioForm.get('groupname').setValue(data.groupname);
            let usersMultiSelect = document.getElementsByTagName('ejs-multiselect')[0]['ej2_instances'][0];
            let selectedUsers = usersMultiSelect.value ? usersMultiSelect.value : [];
            data.users.map(u => {
                this.addUser(u);
                selectedUsers.push(u.user._id );
            });
            usersMultiSelect.value = selectedUsers;
        });
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

        this.gruposService.update(this._id, {
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
        this.addUser({ user: args['itemData'] });
    }

    userRemoved(args: RemoveEventArgs) {
        const index = this.usersAddedToView.findIndex(username => {
            return username === args['itemData']['username'];
        });
        this.users$ = this.usersService.getByNotIn('current').pipe(map(users => users));
        if (index >= 0) {
            this.removeUser(index, false);
        }
    }

    componentCreated(args: Object) {
        this.getGroup(this.route.snapshot.paramMap.get("id"));
    }
}
