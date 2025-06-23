import { Injectable } from '@angular/core';
import {AuthService} from './auth-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  posts: any[] = [];
  loading = true;

  constructor(protected readonly authService: AuthService, private router: Router) {}

  async addPost(message: string, pid?: number, images?: any): Promise<void> {
    const payload = {
      userID: this.authService.getUserID(),
      message: message,
      pid: pid,
      images: images,
    };

    console.log(payload);
    await fetch('https://sociaal.hiddebalestra.nl/add_post.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  private async getPosts(id?:number): Promise<any[]> {
    let res= null;
    if (id){
      res = await fetch(`https://sociaal.hiddebalestra.nl/get_posts.php?id=${id}`);
    } else {
      res = await fetch('https://sociaal.hiddebalestra.nl/get_posts.php');
    }
    const posts = await res.json();

    const decryptedPosts = [];
    for (const post of posts) {
      try {
        decryptedPosts.push({
          id: post.id,
          message: post.message,
          images: post.images,
          username: post.username,
          userID: post.userID,
          timestamp: post.timestamp,
          likes: post.likes,
          dislikes: post.dislikes
        });
      } catch (e) {
        console.error('Fout bij ontsleutelen:', e);
      }
    }

    return decryptedPosts;
  }

  async getPost(id: number): Promise<any> {
    const res = await fetch(`https://sociaal.hiddebalestra.nl/get_post.php?id=${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const post = await res.json();

    return {
      id: post.id,
      message: post.message,
      images: post.images,
      username: post.username,
      userID: post.userID,
      timestamp: post.timestamp,
      likes: post.likes,
      dislikes: post.dislikes,
    };
  }

  private async getPostsByUser(userID: number): Promise<any[]> {
    const res = await fetch(`https://sociaal.hiddebalestra.nl/get_user_posts.php?userID=${userID}`);
    return await res.json();
  }

  likePost(post: any) {
    fetch('https://sociaal.hiddebalestra.nl/like.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')!
      },
      body: JSON.stringify({
        post_id: post.id,
        vote: 1
      })
    })
      .then(async res => {
        const text = await res.text();
        console.log('Response:', text);

        try {
          const json = JSON.parse(text);
          if (json.success) {
            if (json.likes != -1&& json.dislikes != -1) {
              post.likes = json.likes;
              post.dislikes = json.dislikes;
            }
          } else {
            alert('Fout: ' + (json.error || 'Onbekende fout'));
          }
        } catch (e) {
          console.error('Geen geldige JSON:', e);
        }
      })
      .catch(err => {
        console.error('Fetch fout:', err);
      });

  }

  dislikePost(post: any) {
    const token = localStorage.getItem('jwt');
    fetch('https://sociaal.hiddebalestra.nl/like.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        post_id: post.id,
        vote: -1
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (json.likes != -1&& json.dislikes != -1) {
            post.likes = json.likes;
            post.dislikes = json.dislikes;
          }
        } else {
          // alert('Disliken mislukt');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Er ging iets mis');
      });
  }

  async getThePosts(postId?: number) {
    this.posts = [];
    this.loading = true;
    try {
      if (this.router.url.includes('/profile/')) {
        if (!postId) {
          return;
        }
        this.posts = await this.getPostsByUser(postId);
      } else if (this.router.url.includes('/profile')) {
        this.posts = await this.getPostsByUser(parseInt(this.authService.getUserID()));
      } else {
        if (!postId) {
          this.posts = await this.getPosts();
        } else {
          this.posts = await this.getPosts(postId);
        }
      }

      this.posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Fout bij ophalen posts:', error);
    } finally {
      this.loading = false;
    }
  }
}

