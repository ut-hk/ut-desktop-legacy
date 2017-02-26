import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  constructor() {
  }

  info(message: string, title?: string): any {
    alert(message);
  }

  success(message: string, title?: string): any {
    alert(message);
  }

  warn(message: string, title?: string): any {
    alert(message);
  }

  error(message: string, title?: string): any {
    alert(message);
  }

  confirm(message: string, callback?: (result: boolean) => void): any;
  confirm(message: string, title?: string, callback?: (result: boolean) => void): any;

  confirm(message: string, titleOrCallBack?: string | ((result: boolean) => void), callback?: (result: boolean) => void): any {
    if (typeof titleOrCallBack == 'string') {
      confirm(message);
    } else {
      confirm(message);
    }
  }

}
