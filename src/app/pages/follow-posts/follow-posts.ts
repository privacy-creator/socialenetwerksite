import { Component } from '@angular/core';
import {FeedList} from '../../parts/feed-list/feed-list';

@Component({
  selector: 'app-follow-posts',
  imports: [
    FeedList
  ],
  templateUrl: './follow-posts.html',
  styleUrl: './follow-posts.scss'
})
export class FollowPosts {

}
