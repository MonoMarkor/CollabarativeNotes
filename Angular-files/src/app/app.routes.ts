import { Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { PersonalBranchComponent } from './editor/treetable/personalBranch/personalBranch.component';
import { ConnectionGuard } from './Auth/guards/connection.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'editor',
    component: EditorComponent,
    title: 'Text Editor',
  },
  {
    path: 'editor/:id',
    component: EditorComponent,
    title: 'Text Editor',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
        /*canActivate: [ConnectionGuard],*/
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Sign Up',
        /*canActivate: [ConnectionGuard],*/
  },
  {
    path: 'personalBranch',
    component: PersonalBranchComponent,
    title: 'Branch',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'No Page Found',
  },
];
