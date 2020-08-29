import { Component } from '@angular/core';
import { CanvasConfig } from 'projects/ngx-signature-pad/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options = {
    width: 900,
    height: 500,
    backgroundColor: '#F4F5F5',
    borderRadius: 4,
    throttle: 1
  };
}
