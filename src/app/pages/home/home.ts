import { Component } from '@angular/core';
import {FeedList} from '../../parts/feed-list/feed-list';

@Component({
  selector: 'app-home',
  imports: [
    FeedList
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {}
