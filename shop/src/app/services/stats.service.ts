import { Injectable } from '@angular/core';
import {ApiOperationsService} from "./api-operations.service";
import {AuthGuardService} from "./auth-guard.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  public apiOperationsService: ApiOperationsService

  constructor(apiOperationsService: ApiOperationsService,public authGuardService: AuthGuardService, private router: Router) {
    this.apiOperationsService = apiOperationsService
  }

  getSalesByDay(){
    return this.apiOperationsService.get('stats/sales-by-day',{})
  }

  getTopSellersTable(){
    return this.apiOperationsService.get('stats/top-sellers',{})

  }
}
