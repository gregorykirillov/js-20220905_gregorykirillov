import {SortableTable} from '../../components';
import { API_URL_DASHBOARD } from '../../utils/settings';

const header = [
  {
    id: 'images',
    title: 'Фото',
    sortable: false,
    template: data => {
      return `
        <div class='sortable-table__cell'>
          <img class="sortable-table-image" alt="Image" src="${data[0].url}">
        </div>
      `;
    }
  },
  {
    id: 'title',
    title: 'Название',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'quantity',
    title: 'Количество',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Цена',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'status',
    title: 'Статус',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `
        <div class='sortable-table__cell'>
          ${data > 0 ? 'Active' : 'Inactive'}
        </div>
      `;
    }
  },
];

export default class Page {
  date = new Date();

  template() {
    return `
    <div class='products-list'>
      <div class='content__top-panel'>
        <h1 class='page-title'>Товары</h1>
        <a href='/products/add' class='button-primary'>Добавить товар</a>
      </div>
      <div data-element='productsContainer' class='products-list__container'>
    </div>
    `;
  }

  appendSortableTable() {
    this.sortableTable = new SortableTable(header, {
      url: `${API_URL_DASHBOARD}/bestsellers`,
      isSortLocally: false
    });
    
    const container = this.element.querySelector('[data-element="productsContainer"]');
    container.append(this.sortableTable.element);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;

    this.appendSortableTable();
  
    return this.element;
  }

  remove() {
    this.element?.remove();
    this.removeEventListeners();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}