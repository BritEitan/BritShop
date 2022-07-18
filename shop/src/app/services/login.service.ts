import { Injectable } from '@angular/core';
import {ApiOperationsService} from "./api-operations.service";
import {AuthGuardService} from "./auth-guard.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  public static user_info: any = undefined

  public apiOperationsService: ApiOperationsService
  constructor(apiOperationsService: ApiOperationsService,public authGuardService: AuthGuardService) {
    this.apiOperationsService = apiOperationsService
  }

  // if login is successful save user data
  public login(email:string, password: string){
    const observerResult = this.apiOperationsService.create('login', {email, password})
    observerResult.subscribe(result => {this.authGuardService.user_info = result
    localStorage.setItem('user_info',JSON.stringify(result))})
    return observerResult
  }
}
