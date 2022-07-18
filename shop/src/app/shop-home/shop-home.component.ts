import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";
import {AuthGuardService} from "../services/auth-guard.service";
import {ShoppingBagService} from "../services/shopping-bag.service";

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.css']
})
export class ShopHomeComponent implements OnInit {

  constructor(private router: Router, public authService: AuthGuardService, public shoppingBagService: ShoppingBagService) { }

  ngOnInit(): void {

  }

  // Logout user, delete from local storage and move to login
  onLogout(): void{
    this.authService.user_info = undefined
    localStorage.removeItem('user_info')
    this.navigate('/login')

  }

  navigate(url: string){
    this.router.navigateByUrl(url)
  }

}
