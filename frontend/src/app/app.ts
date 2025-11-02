import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Login } from './components/login/login';
import { Cards } from './components/cards/cards';
import { Banner } from './components/banner/banner';
import { Footer } from "./components/footer/footer";
import { Home } from "./components/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Footer,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Stage1_proj');
  showLoginModal = false;

  // Optional: toggle method for convenience
  toggleLoginModal() {
    this.showLoginModal = !this.showLoginModal;
  }
  
}
