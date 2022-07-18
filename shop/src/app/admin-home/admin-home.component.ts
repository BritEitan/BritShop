import { Component, OnInit } from '@angular/core';
import {AdminAuthGuardService} from "../services/admin-auth-guard.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  public mode:string = 'PRODUCTS'

  constructor(private authService: AdminAuthGuardService, public router: Router) { }

  ngOnInit(): void {

  }

}
