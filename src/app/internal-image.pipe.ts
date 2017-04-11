import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'internalImage'
})
export class InternalImagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return 'https://unitime-dev-api.azurewebsites.net/api/File/GetFile/' + value;
  }

}
