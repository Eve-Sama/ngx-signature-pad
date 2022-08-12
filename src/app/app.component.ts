import { Component, HostListener, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private mode: 'mobile' | 'document';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.judgeMode();
  }

  private judgeMode(): void {
    const newMode: 'mobile' | 'document' = this.isMobile() ? 'mobile' : 'document';
    if (newMode !== this.mode) {
      this.mode = newMode;
      this.router.navigate([`/${newMode}`]);
      console.log('jump');
    }
  }

  private isMobile(): boolean {
    if (this.platform.ANDROID || this.platform.IOS) {
      return true;
    }
    // The Platform doesn't work in firefox when open the responsive mode, therfore use innerWidth
    return window.innerWidth <= 400;
  }

  constructor(private platform: Platform, private router: Router) {}

  ngOnInit(): void {
    this.judgeMode();
  }
}
