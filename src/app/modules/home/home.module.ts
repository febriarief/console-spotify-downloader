import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shareds/shared.module';
import { HomeComponent } from './pages';
import { SpotifyService, SpotifySocketService } from './services';


const ROUTES: Routes = [
    { path: '', component: HomeComponent }
];

// const COMPONENTS = [

// ];

const PAGES = [
    HomeComponent
];


@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
        SharedModule,
	],

	exports: [
		RouterModule
	],

  	declarations: [
        // ...COMPONENTS,
        ...PAGES
	],

	providers: [
        SpotifyService,
        SpotifySocketService
	],

    schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
	]
})

export class HomeModule {}
