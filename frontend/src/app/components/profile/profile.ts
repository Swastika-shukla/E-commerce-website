import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  isLoggedIn: boolean = false;
    name: string = '';
    email: string='';
  
    constructor(private loginService: LoginService) {}
    ngOnInit(): void {
      this.updateLoginState();
    }
  
    ngDoCheck(): void {
      this.updateLoginState();
    }
  
    updateLoginState(): void {
      this.loginService.getLoginStatus().subscribe(status => {
        this.isLoggedIn = status;
      });
      this.name = this.loginService.getCurrentName();
      this.email = this.loginService.getCurrentEmail();
    }
  }
