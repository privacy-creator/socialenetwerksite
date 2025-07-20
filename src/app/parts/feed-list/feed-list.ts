import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {Router, ActivatedRoute, RouterLink, NavigationEnd} from '@angular/router';
import {PostDataService} from '../../services/post-data-service';
import {AuthService} from '../../services/auth-service';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';
import {ImageDetail} from '../image-detail/image-detail';

@Component({
  standalone: true,
  selector: 'app-feed-list',
  imports: [DatePipe, RouterLink, ImageDetail],
  templateUrl: './feed-list.html',
  styleUrls: ['./feed-list.scss']
})
export class FeedList implements OnInit {
  lastPage: string | undefined;

  constructor(
    protected readonly postService: PostDataService,
    protected readonly authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.includes('/profile') || this.router.url.includes('/followers') || this.router.url.includes('/posts/') || this.router.url == "/") {
          console.log(Number(id));
          if (this.router.url != this.lastPage) {
            id = this.route.snapshot.paramMap.get('id');
            this.lastPage = this.router.url;
            this.postService.loaded = false;
            this.loadPosts(Number(id));
          }
        }
      }
    });

    this.loadPosts(Number(id));
  }

  ngOnInit() {

  }

  async loadPosts(postId: number) {
    if (!this.postService.loaded) {
      if (postId != null) {
        await this.postService.getThePosts(postId);
      } else {
        await this.postService.getThePosts();
      }
    }
  }

  // Method to convert URLs in text to clickable links
  getSafeMessage(post: string): SafeHtml {
    if (!post) return '';

    let escaped = post
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    escaped = escaped.replace(/\n{2,}/g, '\n\n');
    escaped = escaped.replace(/\n/g, '<br>');

    const wordList = escaped.trim().split(/\s+/);
    const isTruncated = wordList.length > 150;

    const visibleText = wordList.slice(0, 150).join(' ');

    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    let formatted = visibleText.replace(urlRegex, url =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    if (isTruncated) {
      formatted += `<br>... <strong>Read more</strong>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
