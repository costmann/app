import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysesComponent } from './components/analyses/analyses.component';
import { AreasComponent } from './components/areas/areas.component';
import { ConsolidatedComponent } from './components/consolidated/consolidated.component';
import { ExportsComponent } from './components/exports/exports.component';
import { HomeComponent } from './components/home/home.component';
import { LaboratoriesComponent } from './components/laboratories/laboratories.component';
import { LoginComponent } from './components/login/login.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './models/user';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin, Roles.manager, Roles.reader, Roles.analyst, Roles.authority]} },
  { path: 'scheduling', component: SchedulingComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin, Roles.manager, Roles.reader]} },
  { path: 'analyses', component: AnalysesComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin, Roles.analyst, Roles.reader]} },
  { path: 'consolidated', component: ConsolidatedComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin, Roles.manager, Roles.analyst, Roles.reader, Roles.authority]} },
  { path: 'user-settings', component: UserSettingsComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin]} },
  { path: 'laboratories', component: LaboratoriesComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin]} },
  { path: 'areas', component: AreasComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin]} },
  { path: 'exports', component: ExportsComponent, canActivate: [AuthGuard], data: {roles: [Roles.admin, Roles.manager, Roles.reader, Roles.authority]} },
  { path: '**', redirectTo: '/home' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
