import { Component } from '@angular/core';
import { Login } from '../login/login';
import { Banner } from '../banner/banner';
import { Cards } from '../cards/cards';
import { Signup } from "../signup/signup";

@Component({
  selector: 'app-home',
  imports: [Banner, Cards, Login, Signup],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
