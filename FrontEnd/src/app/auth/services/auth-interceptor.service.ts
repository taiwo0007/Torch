import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {exhaustMap, Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return this.authService.user.pipe(
        take(1),
        exhaustMap ( user =>{
          if(!user){
            return next.handle(req);
          }
          const modifiedReq = req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + user.token)
          })
            console.log(modifiedReq)
            console.log(user.token)
          return next.handle(modifiedReq);
        })
    )
  }

}
