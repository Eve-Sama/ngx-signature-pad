import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private router: Router) {}

  private isMobile(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  ngOnInit(): void {
    const url = this.isMobile() ? '/mobile' : '/document';
    this.router.navigate([url]);
  }
}
