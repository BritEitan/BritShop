import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private loginService:LoginService, private router: Router) { }

  public email: string = ""
  public password: string = ""

  ngOnInit(): void {
  }

  // login with BE && move to main page on success \ display error
  onSubmit(){
    this.loginService.login(this.email, this.password).subscribe(response => this.router.navigateByUrl(''), error => alert('Error') )
  }

}
