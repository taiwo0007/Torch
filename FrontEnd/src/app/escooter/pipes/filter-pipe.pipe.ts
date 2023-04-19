import { Pipe, PipeTransform } from '@angular/core';
import {Escooter} from "../models/escooter.interface";

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(items: Escooter[], searchText: string): Escooter[] {

    if(!items){
      return [];
    }

    if(!searchText){
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter( e => {
      return e.modelName.toLowerCase().includes(searchText);
    })

  }

}
