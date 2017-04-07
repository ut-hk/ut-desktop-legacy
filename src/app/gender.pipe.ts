import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 2:
        return 'Male';
      case 3:
        return 'Female';
      default:
        return 'Not Provided';
    }
  }

}
