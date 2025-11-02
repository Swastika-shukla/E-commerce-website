import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(products: any[], searchTerm: string): any[] {
    // Return all products if no search term or empty array
    if (!products || !searchTerm || searchTerm.trim() === '') {
      return products;
    }

    const term = searchTerm.toLowerCase().trim();

    // Search only based on title
    return products.filter(product => {
      const title = product.title?.toLowerCase() || '';
      return title.includes(term);
    });
  }
}
