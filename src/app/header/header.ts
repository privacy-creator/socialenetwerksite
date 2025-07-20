import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {PostDataService} from '../services/post-data-service';
import {AuthService} from '../services/auth-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  search: string | undefined;

  constructor(protected readonly authService: AuthService) {}

}
