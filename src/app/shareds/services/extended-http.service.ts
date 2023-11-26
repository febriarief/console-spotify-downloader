import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()

export class ExtendedHttpInterceptor implements HttpInterceptor {
    constructor(
        public router: Router
    ) {

    }

    /**
     * Identifies and handles a given HTTP request.
     * 
     * @param req The outgoing request object to handle.
     * @param next The next interceptor in the chain, or the backend
     * if no interceptors remain in the chain.
     * @returns An observable of the event stream.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer null`,
                'Content-Type': 'application/json'
            }
        });

        return next.handle(request).pipe(
            tap((ev: HttpEvent<any>) => {
                if (ev instanceof HttpResponse) {

                }
            }),
            catchError(response => {
                return throwError(response);
            })
        );
    }
}
