import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './modules/default-layout/pages';

const ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
            { path: 'home', loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
