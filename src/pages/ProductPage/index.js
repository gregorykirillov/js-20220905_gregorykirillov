import {SortableTable} from '@/components';
import {AddProductPage, MainPage} from '@/pages';
import {API_URL_REST, BACKEND_URL} from '@/utils/settings';
import headerConfig from './headerConfig';

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

    this.components.sortableTable = new SortableTable(headerConfig, {
      url,
      isSortLocally: false
    });
    
    const container = this.element.querySelector('[data-element="productsContainer"]');
    container.append(this.components.sortableTable.element);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
    this.components = {};

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

  removeComponents() {
    Object.entries(this.components).forEach(([_, component]) => component.remove());
  }

  remove() {
    this.element.remove();
    this.removeComponents();
  }

  destroy() {
    this.remove();
  }
}