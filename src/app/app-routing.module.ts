import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';

// MEDIA INDOOR

import { MediaIndoorComponent } from './_pages/mediaindoor/media-indoor.component';

// Usuarios

import { LoginComponent } from './_pages/usuarios/login.component';
import { UsuariosListarComponent } from './_pages/usuarios/usuarios-listar.component';
import { UsuariosCriarComponent } from './_pages/usuarios/usuarios-criar.component';
import { UsuariosEditarComponent } from './_pages/usuarios/usuarios-editar.component';

// Anuncios

import { AnunciosListarComponent } from './_pages/anuncios/anuncios-listar.component';
import { AnunciosCriarComponent } from './_pages/anuncios/anuncios-criar.component';
import { AnunciosEditarComponent } from './_pages/anuncios/anuncios-editar.component';

// Grupos

import { GruposListarComponent } from './_pages/grupos/grupos-listar.component';
import { GruposCriarComponent } from './_pages/grupos/grupos-criar.component';
import { GruposEditarComponent } from './_pages/grupos/grupos-editar.component';

//

import { AuthGuard } from './_helpers';

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

      // GRUPOS

      { path: 'grupos/listar', component: GruposListarComponent, data: { extraParameter: 'gruposMenu' } },
      { path: 'grupos/criar', component: GruposCriarComponent, data: { extraParameter: 'gruposMenu' } },
      { path: 'grupos/editar/:id', component: GruposEditarComponent, data: { extraParameter: 'gruposMenu' } },

      // LOCAIS

      { path: 'locais/listar', component: AnunciosListarComponent, data: { extraParameter: 'locaisMenu' } },
      { path: 'locais/criar', component: AnunciosCriarComponent, data: { extraParameter: 'locaisMenu' } },
      { path: 'locais/editar/:id', component: AnunciosEditarComponent, data: { extraParameter: 'locaisMenu' } },

      // USUARIOS

      { path: 'usuarios/listar', component: UsuariosListarComponent, data: { extraParameter: 'usuariosMenu' } },
      { path: 'usuarios/criar', component: UsuariosCriarComponent, data: { extraParameter: 'usuariosMenu' } },
      { path: 'usuarios/editar/:id', component: UsuariosEditarComponent, data: { extraParameter: 'usuariosMenu' } },
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
