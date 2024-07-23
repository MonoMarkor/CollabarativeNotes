import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConnectionGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkServerConnection().pipe(
      map((isConnected) => {
        if (isConnected) {
          return true;
        } else {
          // Redirect to an error page or show a message
          return this.router.createUrlTree(['/offline']);
        }
      })
    );
  }

  private checkServerConnection(): Observable<boolean> {
    return this.http
      .get('http://localhost:8080/health', { responseType: 'text' })
      .pipe(
        map((response) => response === 'OK'),
        catchError(() => of(false))
      );
  }
}
