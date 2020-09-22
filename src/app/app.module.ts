import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddComponent } from './add/add.component';
import { ShowComponent } from './show/show.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AddModule } from './add/add.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSortModule } from '@angular/material/sort';
import { MessageDialog } from './dialog/message.dialog';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    ShowComponent,
    NavbarComponent,
    MessageDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AddModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [MessageDialog]
})
export class AppModule { }
