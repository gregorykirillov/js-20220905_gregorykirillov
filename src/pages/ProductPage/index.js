import {SortableTable} from '@/components';
import {AddProductPage, MainPage} from '@/pages';
import {API_URL_REST, BACKEND_URL} from '@/utils/settings';

const header = [
  {
    id: 'images',
    title: 'Фото',
    sortable: false,
    template: data => {
      return `
        <div class='sortable-table__cell'>
          ${data[0]?.url ? '<img class="sortable-table-image" alt="Image" src="' + data[0].url + '">' : ''}
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
    id: 'quantity',
    title: 'Количество',
    sortable: true,
    sortType: 'number'
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

  setUrlParams(url) {
    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('_sort', 'title');
    url.searchParams.set('_order', 'desc');
    url.searchParams.set('_start', 0);
    url.searchParams.set('_end', 30);
  }

  appendSortableTable() {
    const url = new URL(`${API_URL_REST}/products`, BACKEND_URL);

    this.setUrlParams(url);

    this.sortableTable = new SortableTable(header, {
      url,
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

    const mainPage = new MainPage();
    mainPage.removePreviousPage();
    
    content.innerHTML = '';
    content.append(renderedPage);
    window.history.pushState(null, null, '/products/add');
  }

  remove() {
    this.sortableTable.remove();
    this.element?.remove();
  }

  destroy() {
    this.remove();
  }
}