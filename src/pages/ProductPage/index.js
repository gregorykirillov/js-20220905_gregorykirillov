import {DoubleSlider, SortableTable} from '@/components';
import {AddProductPage, MainPage} from '@/pages';

import headerConfig from './headerConfig';
import {API_URL_REST, BACKEND_URL} from '@/utils/settings';
import fetchJson from '@/utils/fetch-json';

export default class Page {
  date = new Date();

  template() {
    return `
    <div class='products-list'>
      <div class='content__top-panel'>
        <h1 class='page-title'>Товары</h1>
        <a href='/products/add' class='button-primary'>Добавить товар</a>
      </div>
      <div class="content-box content-box_small">
        <form class="form-inline">
          <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-element="filterName" class="form-control" placeholder="Название товара">
          </div>
          <div class="form-group" data-element="sliderContainer">
            <label class="form-label">Цена:</label>
            </div>
          <div class="form-group">
          <label class="form-label">Статус:</label>
            <select class="form-control" data-element="filterStatus">
              <option value="" selected="">Любой</option>
              <option value="1">Активный</option>
              <option value="0">Неактивный</option>
            </select>
          </div>
        </form>
      </div>
      <div data-element='productsContainer' class='products-list__container'>
    </div>
    `;
  }

  appendSlider() {
    const slider = new DoubleSlider({min: 0, max: 4000});
    
    this.subElements.sliderContainer.append(slider.element);
  }

  setUrlParams(url) {
    const searchParams = this.components?.sortableTable?.searchParams;

    const params = {
      '_embed': searchParams?.['_embed'] || 'subcategory.category',
      '_sort': searchParams?.['_sort'] || 'title',
      '_start': 0,
      '_end': 30,
    };

    this.filteringParams = {...this.filteringParams, ...params};
    this.components.sortableTable?.setSearchParams(this.filteringParams);

    Object.entries(this.filteringParams).forEach(([param, value]) => url.searchParams.set(param, value));
  }

  appendSortableTable() {
    const url = new URL(`${API_URL_REST}/products`, BACKEND_URL);

    this.setUrlParams(url);

    this.components.sortableTable = new SortableTable(headerConfig, {
      url,
      isSortLocally: false
    });
    
    this.subElements.productsContainer.append(this.components.sortableTable.element);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;

    this.components = {};
    this.filteringParams = {};

    this.subElements = this.getSubElements();
    this.appendSortableTable();
    this.appendSlider();
    this.setEventListeners();
  
    return this.element;
  }

  setEventListeners() {
    const button = this.element.querySelector('.button-primary');
    button?.addEventListener('click', this.handleAddProduct);
    
    this.element.addEventListener('range-select', this.handleRangeSelect);
    this.subElements.filterName.addEventListener('input', this.handleChangeName);
    this.subElements.filterStatus.addEventListener('change', this.handleChangeStatus);
  }

  handleChangeName = async(event) => {
    const {value} = event.target;
    const url = new URL(`${API_URL_REST}/products`, BACKEND_URL);

    this.filteringParams = {...this.filteringParams, 'title_like': value};
    this.components.sortableTable?.setSearchParams(this.filteringParams);

    this.setUrlParams(url);
    const data = await fetchJson(url);

    this.components.sortableTable.setData(data);
    this.components.sortableTable.updateData();
  }

  handleChangeStatus = async(event) => {
    const {value} = event.target;
    const url = new URL(`${API_URL_REST}/products`, BACKEND_URL);

    if (value === '') {
      delete this.filteringParams['status'];
    } else {
      this.filteringParams = {...this.filteringParams, 'status': value};
    }
    this.components.sortableTable.setSearchParams(this.filteringParams);
    
    this.setUrlParams(url);
    const data = await fetchJson(url);

    this.components.sortableTable.setData(data);
    this.components.sortableTable.updateData();
  }

  handleRangeSelect = async(event) => {
    const {from, to} = event.detail;
    const url = new URL(`${API_URL_REST}/products`, BACKEND_URL);

    this.filteringParams = {
      ...this.filteringParams, 
      ...this.components.sortableTable.searchParams,
      'price_gte': from,
      'price_lte': to
    };
    this.components.sortableTable.setSearchParams(this.filteringParams);
   
    this.setUrlParams(url);
    const data = await fetchJson(url);

    this.components.sortableTable.setData(data);
    this.components.sortableTable.updateData();
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

  getSubElements() {
    const res = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
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