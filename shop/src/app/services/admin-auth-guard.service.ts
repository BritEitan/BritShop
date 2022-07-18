import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import {LoginService} from "./login.service";
import {AuthGuardService} from "./auth-guard.service";


@Injectable({  providedIn: 'root'})
export class AdminAuthGuardService extends AuthGuardService {

  // if the basic authentication service has a user with is_admin then grant access
  override canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    super.canActivate(route, state)
    return this.user_info.is_admin
  }

}
