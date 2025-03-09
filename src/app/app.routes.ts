import { Routes } from '@angular/router';

import {LayoutAuthComponent} from './layouts/layout-auth/layout-auth.component';
import {LayoutDashComponent} from './layouts/layout-dash/layout-dash.component';
import {LayoutDownloadComponent} from './layouts/layout-download/layout-download.component';

import {LoginComponent} from './pages/authentification/login/login.component';
import {RegisterComponent} from './pages/authentification/register/register.component';

import {DashboardComponent} from './pages/dashboard/dashboard.component';

import {DownloadComponent} from './pages/download/download.component';

import {authGuard} from './guard/auth/auth.guard';
import { noAuthGuard } from './guard/noAuth/noAuth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutAuthComponent,
    title: 'IZara - Authentification',
    children: [
      {
        path: '',
        component: LoginComponent,
        canActivate: [noAuthGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [noAuthGuard],
      },
    ],
  },
  {
    path: '',
    component: LayoutDashComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'IZara - Dashboard',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '',
    component: LayoutDownloadComponent,
    title: 'IZara - Download',
    children: [
      {
        path: 'download',
        component: DownloadComponent,
      },
    ],
  },
];