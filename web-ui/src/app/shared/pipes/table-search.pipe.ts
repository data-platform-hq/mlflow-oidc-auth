import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch'
})
export class TableSearchPipe implements PipeTransform {

  transform(value: any , ...args: unknown[]): [] {
    console.log(value, args);
    return [];
  }

}
