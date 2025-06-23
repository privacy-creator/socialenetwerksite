import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {ActivatedRoute, ParamMap, Router, RouterLink} from '@angular/router';
import {PostDataService} from '../../services/post-data-service';
import {AuthService} from '../../services/auth-service';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-feed-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './feed-list.html',
  styleUrls: ['./feed-list.scss']
})
export class FeedList implements OnInit {

  constructor(
    protected readonly postService: PostDataService,
    protected readonly authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  async ngOnInit() {
    if (this.router.url.includes('/posts/') || this.router.url.includes('/profile/') ) {
      this.route.paramMap.subscribe(async (params: ParamMap) => {
        const idParam = params.get('id');
        const postId = idParam ? +idParam : 0;
        await this.postService.getThePosts(postId);
      });
    } else {
      await this.postService.getThePosts();
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
