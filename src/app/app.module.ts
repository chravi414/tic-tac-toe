import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BoxComponent } from './box/box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, BoardComponent, BoxComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
