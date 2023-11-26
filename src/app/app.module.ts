import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shareds/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './modules/default-layout/pages';
import { DefaultHeaderComponent } from './modules/default-layout/components';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        SharedModule,
        ToastrModule.forRoot(),
    ],

    declarations: [
        AppComponent,
        DefaultHeaderComponent,
        DefaultLayoutComponent,
    ],

    providers: [
        
    ],

    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}
