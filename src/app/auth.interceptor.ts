import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from "./services/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService,
  ) { }

  // Intercept method to handle outgoing HTTP requests
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve current user from UserService
    const user = this.userService.currentUser;

    // If user has a token, add authorization header to the request
    if (user.token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${user.token}`),
      });
    }

    // Pass the modified request to the next interceptor or handler
    return next.handle(request);
  }
}
