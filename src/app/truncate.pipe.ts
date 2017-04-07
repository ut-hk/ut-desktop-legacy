import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const isChinese = value.indexOf(' ') === -1;
    const defaultLimit = isChinese ? 50 : 140;

    const limit = (args != null) && args.length > 0 ? parseInt(args[0], defaultLimit) : defaultLimit;
    const trail = (args != null) && args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
