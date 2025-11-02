import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login';
import { SearchService } from '../../services/search';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] // ✅ corrected from styleUrl to styleUrls
})
export class Navbar {
  isLoggedIn: boolean = false;
  username: string = '';
  email: string = '';

  constructor(private loginService: LoginService, private searchService: SearchService) {}

  ngOnInit(): void {
    this.updateLoginState();
  }

  ngDoCheck(): void {
    this.updateLoginState();
  }

  onSearchChange(value: string): void {
    this.searchService.updateSearchTerm(value.trim());
  }

  updateLoginState(): void {
    this.loginService.getLoginStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
    this.username = this.loginService.getCurrentName(); // ✅ corrected to use getCurrentName()
    this.email = this.loginService.getCurrentEmail();
  }

  logout(): void {
    this.loginService.logout(); // ✅ replaced manual status reset with logout()
    this.updateLoginState();
  }

  loginmodal(): void {
    const modal = document.getElementById('loginModal');
    if (modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      
    }
  }

  signupmodal(): void {
    const modal = document.getElementById('signupModal');
    if (modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }
}
