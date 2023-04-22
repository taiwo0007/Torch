import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {delay, exhaustMap, Observable, take} from "rxjs";
import {LoadingService} from "../../shared/services/loading.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService, private loadingService:LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      return this.authService.user.pipe(
        // delay(2000),
        take(1),
        exhaustMap ( user =>{
          if(!user){
            return next.handle(req);
          }
          const modifiedReq = req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + user._token)
          })
          return next.handle(modifiedReq);
        })
    )
  }

}
