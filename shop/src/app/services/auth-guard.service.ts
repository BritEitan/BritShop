import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import {LoginService} from "./login.service";

@Injectable({  providedIn: 'root'})
export class AuthGuardService implements CanActivate {
  // shared user object
  public user_info: any = undefined

  constructor(private _router:Router) {
  }

  // if user is not logged in, check if there is a user in local storage, else navigate to login
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    if (this.user_info){
      return true;
    }
    const localStorageInfo = localStorage.getItem('user_info')
    if (localStorageInfo && localStorageInfo !== null){
        this.user_info = JSON.parse(localStorageInfo)
    }
    if (this.user_info == undefined)  {
      this._router.navigateByUrl('login')
      return false;
    }
    return true;
  }

}
