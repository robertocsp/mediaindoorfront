import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService, AnunciosService, GruposService, PlacesService, TagsService } from '../../_services';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'app-grupos-editar',
    templateUrl: './grupos-criar-editar.component.html',
    styles: ['.media-img { position: inherit; max-width: 100%; max-height: 100%; }']
})
export class GruposEditarComponent implements OnInit {
    _id: any;
    currentUser: any;
    heading = 'Editar Grupo';
    icon = 'pe-7s-culture icon-gradient bg-mean-fruit';
    loading = false;
    submitted = false;
    grupoForm: FormGroup;
    usersList: FormArray;

    ngOnInit() {
        this.grupoForm = this.formBuilder.group({
            groupname: ['', Validators.required],
            users: this.formBuilder.array([])
        });

        // set contactlist to this field
        this.usersList = this.grupoForm.get('users') as FormArray;

        this.getGroup(this.route.snapshot.paramMap.get("id"));
    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private gruposService: GruposService
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
            user: [user ? user.user : null, Validators.compose([Validators.required])],
            role: [user ? user.role : null, Validators.compose([Validators.required])]
        });
    }

    // add a user form group
    addUser(user) {
        this.usersList.push(this.createUser(user));
    }

    // remove contact from group
    removeUser(index) {
        this.usersList.removeAt(index);
    }

    // get the formgroup under users form array
    getUsersFormGroup(index): FormGroup {
        const formGroup = this.usersList.controls[index] as FormGroup;
        return formGroup;
    }

    getGroup(groupId) {
        this.gruposService.getOne(groupId).subscribe(data => {
            console.log(data);
            console.log(data.users);
            this._id = data._id;
            this.grupoForm.get('groupname').setValue(data.groupname);
            data.users.map(u => this.addUser(u));
        });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.grupoForm.invalid) {
            return;
        }

        this.loading = true;

        const formData = new FormData();
        formData.append('groupname', this.f.groupname.value);
        formData.append('users', this.f.users.value);

        this.gruposService.update(this._id, formData)
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
}
