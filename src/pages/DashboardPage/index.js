import {RangePicker, SortableTable, ColumnChart} from '@/components';

import fetchJson from '@/utils/fetch-json';
import { API_URL_DASHBOARD, BACKEND_URL, DATE_SELECT_EVENT, RANGE } from '@/utils/settings';
import headerConfig from './headerConfig';

export default class Page {
  template() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Лидеры продаж</h3>
        <div data-element="sortableTable"></div>
      </div>`;
  }

  appendRangePicker() {
    this.components.rangePicker = new RangePicker(RANGE);

    this.subElements.rangePicker.append(this.components.rangePicker.element);
  }

  appendColumnCharts() {
    const {from, to} = RANGE;
    const {ordersChart, salesChart, customersChart} = this.subElements;

    this.components.ordersChartEl = new ColumnChart({ url: `${API_URL_DASHBOARD}/orders`, range: { from, to }, label: 'Заказы', link: '#' });
    this.components.salesChartEl = new ColumnChart({ url: `${API_URL_DASHBOARD}/sales`, range: { from, to }, label: 'Продажи', formatHeading: price => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(price)});
    this.components.customersChartEl = new ColumnChart({ url: `${API_URL_DASHBOARD}/customers`, range: { from, to }, label: 'Клиенты' });

    ordersChart.append(this.components.ordersChartEl.element);
    salesChart.append(this.components.salesChartEl.element);
    customersChart.append(this.components.customersChartEl.element);
  }

  setUrlParams({url, from, to}) {
    const start = 0;
    const end = 30;

    url.searchParams.set('_sort', headerConfig.find(el => el.sortable).id);
    url.searchParams.set('_order', 'asc');
    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);
  }

  appendSortableTable() {
    const url = new URL(`${API_URL_DASHBOARD}/bestsellers`, BACKEND_URL);
    const {from, to} = RANGE;

    this.setUrlParams({url, from, to});

    this.components.sortableTable = new SortableTable(headerConfig, {
      url,
      isSortLocally: true
    });
    
    this.subElements.sortableTable.append(this.components.sortableTable.element);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
    this.components = {};

    this.subElements = this.getSubElements(this.element);

    this.appendRangePicker();
    this.appendColumnCharts();
    this.appendSortableTable();

    this.setEventListeners();
      
    return this.element;
  }

  getSubElements() { 
    const res = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
  }

  switchProgressBar(switchType) {
    if (!this.progressBar) {
      this.progressBar = document.querySelector('.progress-bar');
      if (!this.progressBar) {return;}
    }

    if (switchType === 'on') {this.progressBar.style.display = 'block';}
    else if (switchType === 'off') {this.progressBar.style.display = 'none';}
  }

  handleDateSelect = async (event) => {
    this.switchProgressBar('on');
    const {detail: {from, to}} = event;
    const {ordersChart, salesChart, customersChart} = this.subElements;
    
    const promises = [
      this.updateSortableTable(from, to),
      ordersChart.update(from, to),
      salesChart.update(from, to),
      customersChart.update(from, to),
    ];

    await Promise.allSettled(promises);
    this.switchProgressBar('off');
  }

  fetchDataSortableTable(from, to) {    
    const url = new URL(`${API_URL_DASHBOARD}/bestsellers`, BACKEND_URL);

    this.setUrlParams({url, from, to});

    return fetchJson(url);
  }

  async updateSortableTable(from, to) {
    const {sortableTable} = this.subElements;

    sortableTable.element.firstElementChild.classList.add('sortable-table_loading');
    
    const data = await this.fetchDataSortableTable(from, to);
    
    sortableTable.setData(data);
    sortableTable.updateData();
    sortableTable.element.firstElementChild.classList.remove('sortable-table_loading');
  }

  setEventListeners() {
    this.element.addEventListener(DATE_SELECT_EVENT, this.handleDateSelect);
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