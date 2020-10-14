[English](README.md) | 简体中文

## 示例
你可以在[这里](https://mr-eve.github.io/ngx-signature-pad/)查看所有API的详细说明以及应用演示, PC模式和Mobile模式展现的内容不一样, PC侧重文档, Mobile侧重Demo, 详情请自行前往.

## 说明

该项目基于原生插件 [signature_pad](https://github.com/szimek/signature_pad) 开发, 该原生插件只具备很基础的`签名Canvas`的功能. 而本插件在它的基础上使用Angular进行封装, 具备如下特点:
 - 对外提供更加适合Angular风格的API.
 - 提供原生插件不具备的功能, 如`允许用户手动更改状态`、`撤销笔画`、`全屏签名`等.

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
  templateUrl: './app.component.html'
})
export class AppComponent {
  /** 捕获对象, 通过对象调用其实例方法 */
  @ViewChild('signature') signature: NgxSignaturePadComponent;

  /** 配置项, 可以设置ngx-signature-pad的参数, 具体内容参见下文对 NgxSignatureOptions 的详细介绍 */
  options: NgxSignatureOptions = {
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
| `dotSize` | 单点半径. | `number \| (() => number)` | - |
| `minWidth` | 最小线宽. | `number` | `0.5` |
| `maxWidth` | 最大线宽. | `number` | `2.5` |
| `throttle` | 每x毫秒最多绘制一次下一个点, 如果设置为`0`则关闭节流功能. | `number` | `16` |
| `minDistance` | 仅当前一个点比x像素远时才添加下一个点. | `number` | `0.5` |
| `backgroundColor` | 用于清除背景的颜色. 可以是context.fillStyle接受的任何颜色格式, 使用不透明的颜色. 比如 "rgb(255,255,255)" (非透明白色) 如果你想保存JPEG格式的签名. | `string` | `'rgba(0,0,0,0)'` |
| `penColor` | 线条颜色. 可以是context.fillStyle接受的任何颜色格式. | `string` | `'black'` |
| `velocityFilterWeight` | 用于根据先前速度修改新速度的权重. | `number` | `0.7` |
| `width` | 画布的宽度. | `number` | `300px` |
| `height` | 画布的高度. | `number` | `150px` |
| `css` | 自定义画布的样式, 详细可以看demo源码. 需注意, 对于css样式, 使用的是 `Renderer2` 进行渲染的, 不确定是否对所有css样式都有效 | `{ [key: string]: string }` | - |

### 实例方法

| 方法名 | 说明 |
| --- | --- |
| `toDataURL()` | PNG格式的 data URL. |
| `toDataURL("image/jpeg")` | JPEG格式的 data URL. |
| `toDataURL("image/svg+xml")` | SVG格式的 data URL. |
| `fromDataURL()` | 将`base64`的内容画在画布上. |
| `toData()` | 将画布上的内容转化为data URL. |
| `fromData()` | 将data URL转化为画布上的内容. |
| `clear()` | 清除画布内容. |
| `isEmpty()` | 如果画布有内容则会返回`true`, 否则返回`false`. |
| `setDirty()` | 设置画布的状态为脏值, 之后 `isEmpty()` 返回 `false`. |
| `setEmpty()` | 设置画布的状态为空值, 之后 `isEmpty()` 返回 `false`. |
| `revert()` | 撤销画笔的动作. 需要注意, 如果有`全屏签名`和`小屏签名`的切换, 则该功能会有异常, 不建议使用. |
| `fullscreen()` | 使用后可以切换签名模式为全屏签名, 全屏签名的长宽比与小屏签名时的长宽比保持一致. |
| `miniscreen()` | 使用后可以切换签名模式为小屏签名. 初始化组件时, 就是小屏签名. |
| `getContext()` | 获取canvas实例的`Context`, 这与canvas知识点有关, 获取`Context`之后, 你可以为所欲为, 比如使用`drawImage`方法给canvas画画, 可参考PC版Demo的`drawImage`. |

### 在运行时修改配置

本插件允许你在初始化签名组件后, 在运行时修改配置, 你只需修改传入的options即可. 但需注意, 受到Angular `OnChanges`钩子的特性影响(对象变更属性是不会触发该钩子的), 你需要重新赋值对象才可以. 比如初始属性如下:

```typescript
const options: NgxSignatureOptions = {
  penColor: 'rgb(0, 0, 0)' // 黑色
  width: 300,
  height: 150
};
```

在运行代码后, 假如你想修改画笔的颜色, 如果你只是像下面这样写, 是无效的.

```typescript
options.penColor = 'rgb(255, 0, 0)'; // 不会生效, 因为无法触发 OnChanges
```

你需要像下面这样重新赋值.

```typescript
const options: NgxSignatureOptions = {
  penColor: 'rgb(255, 0, 0)' // 把黑色改为红色
  width: 300,
  height: 150
};
```

### 注意

该项目尚未全部完成, 尚在研发中, 当前版本为Beta版.

## 前端开发交流群

欢迎大家加入QQ群 925528845 一起讨论 :D
