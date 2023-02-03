import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';


import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { getItalianPaginatorIntl } from './italian-paginator-intl';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AnalysesComponent } from './components/analyses/analyses.component';
import { AreasComponent } from './components/areas/areas.component';
import { ConsolidatedComponent } from './components/consolidated/consolidated.component';
import { ExportsComponent } from './components/exports/exports.component';
import { HomeComponent } from './components/home/home.component';
import { LaboratoriesComponent } from './components/laboratories/laboratories.component';
import { LoginComponent } from './components/login/login.component';
import { NotesComponent } from './components/notes/notes.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AddAreaDialogComponent } from './components/dialogs/add-area-dialog/add-area-dialog.component';
import { AddLaboratoryDialogComponent } from './components/dialogs/add-laboratory-dialog/add-laboratory-dialog.component';
import { AddNoteDialogComponent } from './components/dialogs/add-note-dialog/add-note-dialog.component';
import { AddUserDialogComponent } from './components/dialogs/add-user-dialog/add-user-dialog.component';
import { ConfirmSheetDialogComponent } from './components/dialogs/confirm-sheet-dialog/confirm-sheet-dialog.component';
import { DeleteAreaDialogComponent } from './components/dialogs/delete-area-dialog/delete-area-dialog.component';
import { DeleteLaboratoryDialogComponent } from './components/dialogs/delete-laboratory-dialog/delete-laboratory-dialog.component';
import { DeleteNoteDialogComponent } from './components/dialogs/delete-note-dialog/delete-note-dialog.component';
import { DeleteSheetDialogComponent } from './components/dialogs/delete-sheet-dialog/delete-sheet-dialog.component';
import { DeleteUserDialogComponent } from './components/dialogs/delete-user-dialog/delete-user-dialog.component';
import { ExportSchedulesDialogComponent } from './components/dialogs/export-schedules-dialog/export-schedules-dialog.component';
import { SaveSheetDialogComponent } from './components/dialogs/save-sheet-dialog/save-sheet-dialog.component';
import { SchedulerDialogComponent } from './components/dialogs/scheduler-dialog/scheduler-dialog.component';
import { SetAreaDialogComponent } from './components/dialogs/set-area-dialog/set-area-dialog.component';
import { AnalysisV01Component } from './components/forms/analysis-v01/analysis-v01.component';
import { GlassV01Component } from './components/forms/glass-v01/glass-v01.component';
import { SheetComponent } from './components/sheets/sheet/sheet.component';
import { T1Component } from './components/sheets/t1/t1.component';
import { T2Component } from './components/sheets/t2/t2.component';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordChangeComponent,
    PasswordResetComponent,
    HomeComponent,
    UserSettingsComponent,
    SchedulingComponent,
    AnalysesComponent,
    ConsolidatedComponent,
    NotesComponent,
    LaboratoriesComponent,
    AreasComponent,
    AddAreaDialogComponent,
    ExportsComponent,
    AddLaboratoryDialogComponent,
    AddNoteDialogComponent,
    AddUserDialogComponent,
    ConfirmSheetDialogComponent,
    DeleteAreaDialogComponent,
    DeleteLaboratoryDialogComponent,
    DeleteNoteDialogComponent,
    DeleteSheetDialogComponent,
    DeleteUserDialogComponent,
    ExportSchedulesDialogComponent,
    SaveSheetDialogComponent,
    SchedulerDialogComponent,
    SetAreaDialogComponent,
    AnalysisV01Component,
    GlassV01Component,
    SheetComponent,
    T1Component,
    T2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getItalianPaginatorIntl() },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
