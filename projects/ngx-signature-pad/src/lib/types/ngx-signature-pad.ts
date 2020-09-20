import { IOptions } from 'signature_pad';

export interface NgxSignatureOptions extends IOptions {
  /** The width of canvas */
  width?: number;
  /** The height of canvas */
  height?: number;
  /** The css of canvas */
  css?: { [key: string]: string };
  // /**
  //  * If it is 'miniScreen', then fullScreen() can't work,
  //  * if it is 'fullScreen', then miniScreen() can't work,
  //  * if it is 'both', you can switch screen mode as you want.
  //  */
  // modeOption?: 'miniScreen' | 'fullScreen' | 'both';
  // /** Init pad mode */
  // mode?: 'miniScreen' | 'fullScreen';
}
