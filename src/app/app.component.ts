import { Component, OnInit } from '@angular/core';
import { OnSameUrlNavigation } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Titulo';
  //throw new Error('Method not implemented.');

  constructor(private Router: Router) {}

  ngOnInit(): void {
    this.Router.navigate(['inicio']);
  }
}
