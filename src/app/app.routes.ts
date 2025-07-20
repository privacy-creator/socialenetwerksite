import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import {PostDetail} from './pages/post-detail/post-detail';
import {NewPost} from './pages/new-post/new-post';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {AuthGuard} from './auth-guard';
import {Profile} from './pages/profile/profile';
import {FollowPosts} from './pages/follow-posts/follow-posts';
import {Search} from './pages/search/search';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'posts/new', component: NewPost, canActivate: [AuthGuard] },
  { path: 'posts/:id', component: PostDetail },
  { path: 'search/:search', component: Search },
  { path: 'followers', component: FollowPosts },

  { path: 'profile', component: Profile, canActivate: [AuthGuard]},
  { path: 'profile/:id', component: Profile },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
