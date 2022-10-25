import fetchJson from '@/utils/fetch-json';
import { BACKEND_URL, CLEAR_FILTERS_EVENT } from '@/utils/settings';
import EmptyPlaceholder from '../EmptyPlaceholder';

export default class SortableTable {
  PAGINATION_COUNT = 30;
  BOTTOM_GAP = 50;
  isLoading = false;
  allLoaded = false;
  
  paginationStart = 0;
  data = [];

  constructor(headerConfig, {
    sortedElement = headerConfig.find(el => el.preSorting) || headerConfig.find(el => el.sortable),
    sorted = {
      id: sortedElement.id,
      order: sortedElement.order || 'asc',
    },
    isSortLocally = false,
    url = '',
    needFetchData = true,
    searchParams = {},
  } = {}) {
    this.headerConfig = headerConfig;
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.needFetchData = needFetchData;
    this.searchParams = searchParams;

    this.render();
  }
  
  setEventListeners() {
    this.subElements.header.addEventListener('click', this.onSortClick);
    document.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = async() => {
    if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight - this.BOTTOM_GAP) {
      return;
    }
    if (!this.isLoading && !this.allLoaded && this.needFetchData) {
      this.setLoading(true);
      const res = await this.getNewData();
      if (res.length === 0) {
        this.allLoaded = true;

        return;
      }
      this.setData([...this.data, ...res]);
      this.updateData();

      this.setPaginationStart(this.paginationStart + this.PAGINATION_COUNT);
      this.setLoading(false);
    }
  }
  
  setSearchParams(searchParams) {
    const params = {};

    for (const param of this.url.searchParams) {
      params[param[0]] = param[1];
    }

    if (searchParams) {
      Object.entries(searchParams).forEach(([name, value]) => {
        params[name] = value;
      });
    }
    
    this.searchParams = params;
  }

  setUrlParams(url) {
    Object.entries(this.searchParams).forEach(([name, value]) => {
      url.searchParams.set(name, value);
    });
  }

  async getNewData() { 
    this.setUrlParams(this.url);

    this.url.searchParams.set('_start', this.paginationStart);
    this.url.searchParams.set('_end', this.paginationStart + this.PAGINATION_COUNT);
      
    this.setSearchParams({
      '_start': this.paginationStart,
      '_end': this.paginationStart + this.PAGINATION_COUNT,
    });
    
    const data = await fetchJson(this.url);

    return data;
  }

  setLoading(flag) {
    if (flag) {
      const element = document.createElement('div');
      element.innerHTML = '<div data-element="loading" class="loading-line sortable-table__loading-line"></div>';

      this.subElements.body.parentNode.append(element.firstElementChild);
    } else {
      this.subElements.loading.remove();
    }
    this.isLoading = flag;
  }

  setPaginationStart(count) {
    this.paginationStart = count;
  }

  sortOnClient(id = this.sorted.id, order = this.sorted.order) {
    let direction;
    if (order === 'asc') {
      direction = 1;
    }
    else if (order === 'desc') {
      direction = -1;
    }

    const { sortType } = this.headerConfig.filter(el => el.id === id)[0];

    this.data.sort((a, b) => {
      if (sortType === 'number') {
        return direction * (a[id] - b[id]);
      }
      else if (sortType === 'string') {
        return direction * a[id].localeCompare(b[id], ['ru', 'en'], { caseFirst: 'upper' });
      }
    });

    this.updateData();
    this.subElements = this.getSubElements();
  }

  async sortOnServer (id = this.sorted.id, order = this.sorted.order) {
    const end = this.paginationStart ? this.paginationStart : this.paginationStart + this.PAGINATION_COUNT;

    const params = {
      '_sort': id,
      '_order': order,
      '_start': 0,
      '_end': end,
    };

    Object.entries(params).forEach(([name, value]) => {
      this.url.searchParams.set(name, value);
    });
    
    this.setSearchParams({...this.searchParams, ...params});

    this.setUrlParams(this.url);

    const res = await fetchJson(this.url);
    this.setData(res);

    this.updateData();
    this.subElements = this.getSubElements();
  }

  onSortClick = event => {
    const sortEl = event.target.closest('[data-sortable="true"]');
    if (!sortEl) {return;}

    const { id } = sortEl.dataset;
    const { order } = this.sorted;

    this.setSorted(id, order);
    
    if (this.isSortLocally) {
      this.sortOnClient();
    }
    else {
      this.sortOnServer();
    }
  }
  
  get headerTemplate() {
    return `
      ${this.headerConfig.map(({id, title, sortable}) => this.headerColTemplate({id, title, sortable})).join('')}`;
  }

  headerColTemplate({id, title, sortable}) {
    const isSortedCell = id === this.sorted.id;
    const [dataOrder, elementOfSort] = isSortedCell
      ? [`data-order='${this.sorted.order}'`, this.getArrowSort()]
      : ['', ''];

    return `
      <div class='sortable-table__cell' data-id='${id}' data-sortable='${sortable}' ${dataOrder}>
        <span>${title}</span>
        ${elementOfSort}
      </div>`;
  }

  get bodyProducts() {
    const columns = this.headerConfig.map(el => el.id);

    return this.data.map(el => `
    <a href='/products/${el.id}' class='sortable-table__row'>

      ${columns.map((col, ind) => this.headerConfig[ind].template
    ? this.headerConfig[ind].template(el[col])
    : `<div class='sortable-table__cell'>${el[col]}</div>`
  ).join('')}
    </a>`).join('');
  }
  
  get template() {
    return `
      <div class='sortable-table'>
        <div data-element='header' class='sortable-table__header sortable-table__row'>
          ${this.headerTemplate}
        </div>
        <div data-element='body' class='sortable-table__body'>
          ${this.bodyProducts}
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        </div>
      </div>`;
  }

  getArrowSort() {
    return (
      `<span data-element='arrow' class='sortable-table__sort-arrow'>
        <span class='sort-arrow'></span>
      </span>`
    );
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    
    if (this.isSortLocally) {
      const data = await this.getNewData();
      
      this.setData(data);
      this.sortOnClient();
    } else {
      await this.sortOnServer();
    }

    this.setLoading(true);
    
    this.subElements = this.getSubElements();
    this.updateData();
    this.setEventListeners();
    this.setPaginationStart(this.paginationStart + this.PAGINATION_COUNT);

    this.setSearchParams();

    this.setLoading(false);
  }

  setData(data) {
    this.data = data;
  }

  updateData() {
    if (!this.subElements || !Object.keys(this.subElements).length) {return;}
    const { body, header } = this.subElements;

    header.innerHTML = this.headerTemplate;
    body.innerHTML = this.data.length 
      ? this.bodyProducts
      : EmptyPlaceholder;
      
    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements();
    if (this.subElements.emptyPlaceholder) {
      this.subElements.emptyPlaceholder.addEventListener('click', this.onClearFiltersClick);
    }
  }

  onClearFiltersClick = () => {
    this.element.dispatchEvent(new CustomEvent(CLEAR_FILTERS_EVENT, {
      bubbles: true,
    }));
  }

  setSorted(id, order) {
    const togglerMap = {
      'asc': 'desc',
      'desc': 'asc',
    };
    this.sorted.id = id;
    this.sorted.order = togglerMap[order];
  }

  getSubElements() {
    const res = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
  }

  remove() {
    this.element?.remove();
    this.subElements = {};
    document.removeEventListener('scroll', this.handleScroll);
  }

  destroy() {
    this.remove();
  }
}