import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {PostDataService} from '../services/post-data-service';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  constructor(protected readonly authService: AuthService) {}
}
