import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthenticationService} from './authentification.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  redirectUrl: string;

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.redirectUrl = state.url;

    const roles = route.data['roles'];
    const currentUser = localStorage.getItem('currentUser');
    const currentToken = localStorage.getItem('currentUserToken');
    const currentRole = localStorage.getItem('currentUserRole');

    if (currentUser == null || currentToken == null) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return roles.indexOf(currentRole) !== -1;
    }
  }
}
