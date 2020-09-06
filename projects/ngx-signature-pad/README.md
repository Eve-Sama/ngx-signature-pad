## 示例
你可以在[这里](https://mr-eve.github.io/ngx-signature-pad/)查看所有API的详细说明以及应用演示.

## 安装

通过NPM
```bash
npm install --save @eve-sama/ngx-signature_pad
```

通过Yarn
```bash
yarn add --save @eve-sama/ngx-signature_pad
```

## 使用

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
    // 你需要在应用组件所在的模块中导入 ngx-signature-pad 模块
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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** 捕获对象, 通过对象调用其实例方法 */
  @ViewChild('signature') signature: NgxSignaturePadComponent;

  /** 配置项, 可以设置ngx-signature-pad的参数, 具体内容参见下文对 NgxSignatureOptions 的详细介绍 */
  public options: NgxSignatureOptions = {
    backgroundColor: '#F4F5F5',
    width: 570,
    height: 300,
    css: {
      'border-radius': '16px'
    }
  };

  /** 开始签字的事件 */
  onBegin(): void { }

  /** 停止签字的事件 */
  onEnd(): void { }
}
```
### NgxSignatureOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `dotSize` | Radius of a single dot. | `number | (() => number)` | - |
| `minWidth` | Minimum width of a line. | `number` | `0.5` |
| `maxWidth` | Maximum width of a line. | `number` | `2.5` |
| `throttle` | Draw the next point at most once per every x milliseconds. Set it to 0 to turn off throttling. | `number` | `16` |
| `minDistance` | Add the next point only if the previous one is farther than x pixels. | `number` | `0.5` |
| `backgroundColor` | Color used to clear the background. Can be any color format accepted by context.fillStyle. Use a non-transparent color e.g. "rgb(255,255,255)" (opaque white) if you'd like to save signatures as JPEG images. | `string` | `'rgba(0,0,0,0)'` |
| `penColor` | Color used to draw the lines. Can be any color format accepted by context.fillStyle. | `string` | `'black'` |
| `velocityFilterWeight` | Weight used to modify new velocity based on the previous velocity. | `number` | `0.7` |

### 实例方法

| 方法名 | 说明 |
| --- | --- |
| `toDataURL()` | Get data URL of it as PNG. |
| `toDataURL("image/jpeg")` | Get data URL of it as JPEG. |
| `toDataURL("image/svg+xml")` | Get data URL of it as SVG. |
| `fromDataURL()` | Draws signature image from data URL, you need to pass it with `base64`. |
| `toData()` | 等我做个实验再说 |
| `fromData()` | 等我做个实验再说 |
| `clear()` | Clears the canvas. |
| `isEmpty()` | Returns true if canvas is empty, otherwise returns false. |
