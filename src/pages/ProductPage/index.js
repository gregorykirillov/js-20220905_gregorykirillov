import {SortableTable} from '@/components';
import {AddProductPage} from '@/pages';
import { API_URL_DASHBOARD } from '@/utils/settings';

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
    id: 'subcategory',
    title: 'Категория',
    sortable: false,
    template: subcategory => {
      return `
      <div class="sortable-table__cell">
        <span data-tooltip="
          <div class='sortable-table-tooltip'>
            <span class='sortable-table-tooltip__category'>${subcategory.category.title}</span> /
            <b class='sortable-table-tooltip__subcategory'>${subcategory.title}</b>
          </div>">
          ${subcategory.title}
        </span>
      </div>`;
    }
  },
  {
    id: 'price',
    title: 'Цена',
    sortable: true,
    sortType: 'number',
    template: price => `<div class="sortable-table__cell">
      ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(price)}
    </div>`
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
    this.setEventListeners();
  
    return this.element;
  }

  setEventListeners() {
    const button = this.element.querySelector('.button-primary');
    button?.addEventListener('click', this.handleAddProduct);
  }

  async handleAddProduct(event) {
    event.preventDefault();

    const page = new AddProductPage();
    const renderedPage = await page.render();
    
    const content = document.body.querySelector('#content');
    content.innerHTML = '';
    content.append(renderedPage);
    window.history.pushState(null, null, '/products/add');
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