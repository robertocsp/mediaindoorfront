import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService, AnunciosService, GruposService, PlacesService, TagsService } from '../../_services';
import { Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectEventArgs } from '@syncfusion/ej2-lists';
import { RemoveEventArgs } from '@syncfusion/ej2-dropdowns';

@Component({
    selector: 'app-anuncios-criar',
    templateUrl: './anuncios-criar-editar.component.html',
})
export class AnunciosCriarComponent implements OnInit {
    currentUser: any;
    heading = 'Criar Anúncio';
    icon = 'pe-7s-monitor icon-gradient bg-mean-fruit';
    loading = false;
    submitted = false;
    anuncioForm: FormGroup;
    arquivo$: File;
    tags$: Observable<any>;
    places$: Observable<any>;
    groups$: Observable<any>;
    public groupsFields: Object = { text: 'groupname', value: '_id' };
    public groupsWaterMark: string = 'Grupos';
    public placesFields: Object = { text: 'placename', value: '_id' };
    public placesWaterMark: string = 'Locais';
    public tagsFields: Object = { text: 'tagname', value: 'tagname' };
    public tagsWaterMark: string = 'Tags';

    ngOnInit() {
        this.anuncioForm = this.formBuilder.group({
            adname: ['', Validators.required],
            type: ['', Validators.required],
            mimetype: ['', Validators.required],
            duration: ['', Validators.required],
            weight: [''],
            mediapath: [null, Validators.required],
            tags: [[]],
            places: [[]],
            groups: [[]]
        });
        this.places$ = this.placesService.getAll().pipe(map(places => places));
        this.groups$ = this.gruposService.getAll().pipe(map(groups => groups));
        this.tags$ = this.tagsService.getAll().pipe(map(tags => tags));
    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private anunciosService: AnunciosService,
        private gruposService: GruposService,
        private placesService: PlacesService,
        private tagsService: TagsService
    ) {
        this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    }

    // convenience getter for easy access to form fields
    get f() { return this.anuncioForm.controls; }

    onFileSelect(event) {
        if (event.target.files.length > 0) {
            this.arquivo$ = event.target.files[0];
            this.f.mimetype.setValue(this.arquivo$.type);
        }
    }

    groupSelected(args: SelectEventArgs) {
        let selectedGroups = document.getElementById("groups")['ej2_instances'][0].value;
        let selectedGroupsCopy = [...selectedGroups];
        selectedGroupsCopy.push(args['itemData']._id);
        this.places$ = this.placesService.getByNotInGroup(selectedGroupsCopy.join(';')).pipe(map(places => {
            let placesMultiSelect = document.getElementById("places")['ej2_instances'][0];
            let selectedPlaces = placesMultiSelect.value;

            selectedPlaces = selectedPlaces.filter(function(n) {
                return places.map(function(e) { return e.id; }).indexOf(n) !== -1;
            });

            placesMultiSelect.value = selectedPlaces;
            return places;
        }));
    }

    groupRemoved(args: RemoveEventArgs) {
        let selectedGroups = document.getElementById("groups")['ej2_instances'][0].value;
        let groups = selectedGroups.join(';');
        if(groups) {
            this.places$ = this.placesService.getByNotInGroup(groups).pipe(map(places => places));
        } else {
            this.places$ = this.placesService.getAll().pipe(map(places => places));
        }
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.anuncioForm.invalid) {
            return;
        }

        this.loading = true;

        const formData = new FormData();
        formData.append('adname', this.f.adname.value);
        formData.append('type', this.f.type.value);
        formData.append('mimetype', this.f.mimetype.value);
        formData.append('duration', this.f.duration.value);
        if(this.f.weight.value) {
            formData.append('weight', this.f.weight.value);
        }
        formData.append('mediapath', this.arquivo$);
        if(this.f.tags.value.length) {
            formData.append('tags', this.f.tags.value);
        }
        if(this.f.places.value.length) {
            formData.append('places', this.f.places.value);
        }
        if(this.f.groups.value.length) {
            formData.append('groups', this.f.groups.value);
        }

        this.anunciosService.add(formData)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['arealogada/anuncios/listar']);
                },
                error => {
                    //this.error = error;
                    console.error(error);
                    this.loading = false;
                });
    }
}
