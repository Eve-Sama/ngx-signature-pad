English | [简体中文](https://github.com/Mr-Eve/ngx-signature-pad/blob/master/README-zh_CN.md)

## Demo
You can see all detail directions of API and demo in [here](https://mr-eve.github.io/ngx-signature-pad/)

## Direction

This project is based on canvas plugin [signature_pad](https://github.com/szimek/signature_pad), and the canvas plugin only has basic functions, like `signature canvas`. I have encapsulated it with Angular which has the following features:
 - Provide API more suitable style for Angular.
 - Provide features not available in native plugins, like `modify state of signature manually`、`revert painting`、`fullscreen to sign` and so on.

## Install

Via NPM
```bash
npm install --save @eve-sama/ngx-signature_pad
```

Via yarn
```bash
yarn add --save @eve-sama/ngx-signature_pad
```

## Usage

### AppModule
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { NgxSignaturePadModule } from '@eve-sama/ngx-signature-pad';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // You need to import module of ngx-signature-pad
    NgxSignaturePadModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### AppComponent
```html
<ngx-signature-pad
  #signature
  [options]="options"
  (onBegin)="onBegin()"
  (onEnd)="onEnd()">
</ngx-signature-pad>
```
```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxSignaturePadComponent, NgxSignatureOptions } from '@eve-sama/ngx-signature-pad';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  /** Catch object, call functions via instance object */
  @ViewChild('signature') signature: NgxSignaturePadComponent;

  /** You can see more introduction in the below about NgxSignatureOptions */
  public options: NgxSignatureOptions = {
    backgroundColor: '#F4F5F5',
    width: 570,
    height: 300,
    css: {
      'border-radius': '16px'
    }
  };

  /** The begin event of sign */
  onBegin(): void { }

  /** The end event of sign */
  onEnd(): void { }
}
```
### NgxSignatureOptions

| Params | Direction | Type | Default |
| --- | --- | --- | --- |
| `dotSize` | Radius of a single dot. | `number \| (() => number)` | - |
| `minWidth` | Minimum width of a line. | `number` | `0.5` |
| `maxWidth` | Maximum width of a line. | `number` | `2.5` |
| `throttle` | Draw the next point at most once per every x milliseconds. Set it to 0 to turn off throttling. | `number` | `16` |
| `minDistance` | Add the next point only if the previous one is farther than x pixels. | `number` | `0.5` |
| `backgroundColor` | Color used to clear the background. Can be any color format accepted by context.fillStyle. Use a non-transparent color e.g. "rgb(255,255,255)" (opaque white) if you'd like to save signatures as JPEG images. | `string` | `'rgba(0,0,0,0)'` |
| `penColor` | Color used to draw the lines. Can be any color format accepted by context.fillStyle. | `string` | `'black'` |
| `velocityFilterWeight` | Weight used to modify new velocity based on the previous velocity. | `number` | `0.7` |

### Instance Method

| Fcuntion | Direction |
| --- | --- |
| `toDataURL()` | Get data URL of it as PNG. |
| `toDataURL("image/jpeg")` | Get data URL of it as JPEG. |
| `toDataURL("image/svg+xml")` | Get data URL of it as SVG. |
| `fromDataURL()` | Draws signature image from data URL, you need to pass it with `base64`. |
| `toData()` | Returns signature image as an array of point groups. |
| `fromData()` | Draws signature image from data URL. |
| `clear()` | Clears the canvas. |
| `isEmpty()` | Returns true if canvas is empty, otherwise returns false. |
| `setDirty()` | Set pad's state as dirty, then `isEmpty()` return false. |
| `setEmpty()` | Set pad's state as empty, then `isEmpty()` return true. |
| `revert()` | Undo the last action. Notice that if you have the change of `fullscreen()` and `miniscreen()`, the `revert()` can not work after you change the mode. Under this situation, I do not recommend use it. |
| `fullscreen()` | You can change the mode to fullscreen, the aspect ratio of the fullscreen signature is the same as that of the miniscreen signature. |
| `miniscreen()` | You can change the mode to miniscreen. The inicial mode is miniscreen when you init the component. |

### Notice

The project has not been completed yet, it is still under development, the current version is Beta

## Front-end development exchange group

Welcome everyone to join the QQ group 925528845 to discussion :D
