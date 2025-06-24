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
  constructor(
    protected readonly postService: PostDataService,
    protected readonly authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
  ) {}
  lastPage: string | undefined;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.includes('/profile') || this.router.url.includes('/followers') || this.router.url.includes('/posts/') || this.router.url == "/") {
          if (this.router.url != this.lastPage) {
            this.lastPage = this.router.url;
            this.postService.loaded = false;
          }
        }
      }
    });

    if (!this.postService.loaded){
      if (id != null){
        await this.postService.getThePosts(Number(id));
      } else {
        await this.postService.getThePosts();
      }
    }
  }

  // Method to convert URLs in text to clickable links
  getSafeMessage(post: string): SafeHtml {
    if (!post) {
      return '';
    }

    // Regular expression to match URLs (including .nl, .com, etc.)
    const urlRegex = /(https?:\/\/[^\s<]+(?:\.nl|\.com|\.org|\.net|\.edu|\.gov|\.co|\.io|\.biz|[^\s<]+))/g;

    // Replace URLs with anchor tags
    const formattedMessage = post.replace(
      urlRegex,
      (url: string) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Sanitize the HTML to prevent XSS attacks
    return this.sanitizer.bypassSecurityTrustHtml(formattedMessage);
  }
}
