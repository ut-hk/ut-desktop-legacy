import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'internalImage'
})
export class InternalImagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const url = 'unitime-dev-api.azurewebsites.net/api/File/GetFile/' + value;
    return 'https://images.weserv.nl/?url=' + encodeURI(url) + '&output=jpg';
  }

}
