import { Injectable } from '@angular/core';

@Injectable()
export class LogService {

  constructor() {
  }

  debug(logObject?: any): void {
    console.log(logObject);
  }

  info(logObject?: any): void {
    console.info(logObject);
  }

  warn(logObject?: any): void {
    console.warn(logObject);
  }

  error(logObject?: any): void {
    console.error(logObject);
  }

  fatal(logObject?: any): void {
    console.error(logObject);
  }

}
