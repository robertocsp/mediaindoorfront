import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService, GruposService } from '../../_services';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'app-grupos-criar',
    templateUrl: './grupos-criar-editar.component.html',
})
export class GruposCriarComponent implements OnInit {
    currentUser: any;
    heading = 'Criar Grupo';
    icon = 'pe-7s-culture icon-gradient bg-mean-fruit';
    loading = false;
    submitted = false;
    grupoForm: FormGroup;
    usersList: FormArray;

    ngOnInit() {
        this.grupoForm = this.formBuilder.group({
            groupname: ['', Validators.required],
            users: this.formBuilder.array([this.createUser()])
        });

        // set contactlist to this field
        this.usersList = this.grupoForm.get('users') as FormArray;
    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private gruposService: GruposService,
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
    createUser(): FormGroup {
        return this.formBuilder.group({
            user: [null, Validators.compose([Validators.required])],
            role: [null, Validators.compose([Validators.required])]
        });
    }

    // add a user form group
    addUser(user) {
        this.usersList.push(this.createUser());
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

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.grupoForm.invalid) {
            return;
        }

        this.loading = true;

        const formData = new FormData();
        formData.append('groupname', this.f.groupname.value);

        console.log(this.f.users.value);

        this.gruposService.add(formData)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['arealogada/grupos/listar']);
                },
                error => {
                    //this.error = error;
                    console.error(error);
                    this.loading = false;
                });
    }
}
