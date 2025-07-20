import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search implements OnInit {
  // query: string = '';
  results: {
    users: { id: number; username: string }[];
    posts: { id: number; username: string; message: string }[];
  } = {
    users: [],
    posts: []
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const search = params.get('search');
      if (search && search.length >= 2) {
        // this.query = search;
        this.doSearch(search);
      }
    });
  }

  async doSearch(search: string) {
    const response = await fetch(`https://sociaal.hiddebalestra.nl/search.php?q=${encodeURIComponent(search)}`);
    this.results = await response.json();
  }
}
