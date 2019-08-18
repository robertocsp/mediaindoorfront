import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';

// MEDIA INDOOR

import { MediaIndoorComponent } from './_pages/mediaindoor/media-indoor.component';

// Usuarios

import { LoginComponent } from './_pages/usuarios/login.component';

// Anuncios

import { AnunciosListarComponent } from './_pages/anuncios/anuncios-listar.component';
import { AnunciosCriarComponent } from './_pages/anuncios/anuncios-criar.component';
import { AnunciosEditarComponent } from './_pages/anuncios/anuncios-editar.component';

//

import { AuthGuard } from './_helpers';
import { NgbdPaginationAdvanced } from './_teste/pagination-advanced';

const routes: Routes = [
  {
    path: 'arealogada',
    component: BaseLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/arealogada/anuncios/listar', pathMatch: 'full' },

      // ANUNCIOS

      { path: 'anuncios/listar', component: AnunciosListarComponent, data: { extraParameter: 'anunciosMenu' } },
      { path: 'anuncios/criar', component: AnunciosCriarComponent, data: { extraParameter: 'anunciosMenu' } },
      { path: 'anuncios/editar/:id', component: AnunciosEditarComponent, data: { extraParameter: 'anunciosMenu' } },
    ]

  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [

      { path: '', component: LoginComponent, data: { extraParameter: '' } },
    ]
  },
  { path: 'mediaindoor/:place', component: MediaIndoorComponent, data: { extraParameter: '' } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
