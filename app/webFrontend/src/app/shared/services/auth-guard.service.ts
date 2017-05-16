import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {UserService} from './user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  redirectUrl: string;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.redirectUrl = state.url;

    const roles = route.data['roles'];

    if (!this.authenticationService.isLoggedIn) {
      this.router.navigate(['/login']);

      return false;
    } else {
      return roles.indexOf(this.userService.user.role) !== -1;
    }
  }
}
