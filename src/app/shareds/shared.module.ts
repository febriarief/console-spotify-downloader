import { CommonModule } from "@angular/common"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExtendedHttpInterceptor } from "./services";


// const COMPONENTS = [

// ];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
        MatTooltipModule,
        MatProgressBarModule
	],

	exports: [
        // ...COMPONENTS,
        CommonModule,
		FormsModule,
		HttpClientModule,
        MatTooltipModule,
        MatProgressBarModule
	],

	declarations: [
        // ...COMPONENTS
    ],

	providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ExtendedHttpInterceptor,
            multi: true
        }
    ],

	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
	]
})

export class SharedModule { }
