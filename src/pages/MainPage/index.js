import {AddProductPage, CategoriesPage, DashboardPage, ProductPage, SalesPage} from '@/pages';
import { Notification, Tooltip } from '@/components';
import {leftBarTemplate} from './templates';
import { PRODUCT_SAVED_EVENT, PRODUCT_UPDATED_EVENT } from '@/utils/settings';

export default class Page {
  constructor() {
    this.render();
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = leftBarTemplate();
    document.body.append(element.firstElementChild);

    this.element = element.firstElementChild;
    this.content = document.querySelector('#content');
  
    const tooltip = new Tooltip();
    tooltip.initialize();

    const renderedPage = await this.renderPage();
    this.content.append(renderedPage);
    this.setButtonActive();
    
    this.setEventListeners();

    return this.element;
  }

  async renderPage() {
    const Page = this.getPageByLocation();
    const page = new Page();
    const renderedPage = await page.render();

    return renderedPage;
  }

  setEventListeners() {
    document.querySelector('.sidebar__nav').addEventListener('click', this.handleChangePage);
    document.querySelector('button.sidebar__toggler').addEventListener('click', this.handleCollapseSidebar);
    
    document.addEventListener(PRODUCT_UPDATED_EVENT, this.handleProduct);
    document.addEventListener(PRODUCT_SAVED_EVENT, this.handleProduct);

    window.addEventListener('load', this.handleLoaded);
    console.log('load', window.addEventListener('load', this.handleLoaded));
  }

  handleProduct = (event) => {
    let notify = '';
    if (event.type === PRODUCT_SAVED_EVENT) {
      notify = new Notification('Продукт успешно создан', {duration: 2000});
    } else if (event.type === PRODUCT_UPDATED_EVENT) {
      notify = new Notification('Продукт успешно сохранен', {duration: 2000});
    }

    notify.show();

    document.body.append(notify.element);
  }

  // handleStateChanged = (event) => {
  //   const state = event.srcElement.readyState;
  //   console.log(state);
  //   if (state === 'complete') {this.handleLoaded();}
  // }

  handleLoaded = () => {
    this.switchProgressBar('off');
  }

  handleCollapseSidebar = () => {
    document.body.classList.toggle('is-collapsed-sidebar');
  }
  
  switchProgressBar(switchType) {
    if (!this.progressBar) {
      this.progressBar = document.querySelector('.progress-bar');
      if (!this.progressBar) {return;}
    }
  
    if (switchType === 'on') {this.progressBar.style.display = 'block';}
    else if (switchType === 'off') {this.progressBar.style.display = 'none';}
  }
  
  clearActiveButton(event) {
    if (!event) {return;}

    const buttonsList = event.target.closest('ul');

    [...buttonsList.children].forEach(el => el.classList.remove('active'));
  }

  setButtonActive(event = null) {
    let button;
    if (!event) {
      let path = window.location.pathname.slice(1) || 'dashboard';
      
      if (path.includes('products')) {
        path = 'products';
      }

      button = document.querySelector(`[data-page="${path}"]`).closest('li');
    } else {
      button = event.target.closest('li');
    }
    if (!button) {return;}

    this.clearActiveButton(event);
    button.classList.add('active');
  }

  handleChangePage = async (event) => {
    this.switchProgressBar('on');
    event.preventDefault();

    this.setButtonActive(event);

    const pageButton = event.target.closest('[data-page]');
    if (!pageButton) {
      this.switchProgressBar('off');
      return;
    }

    const path = pageButton.dataset.page;
    window.history.pushState(null, null, `/${path}`);
    
    const renderedPage = await this.renderPage();
    this.content.innerHTML = '';
    this.content.append(renderedPage);
    this.switchProgressBar('off');
  }

  getPageByLocation() {
    const pages = {
      '/': DashboardPage,
      '/dashboard': DashboardPage,
      '/products': ProductPage,
      // '/categories': CategoriesPage,
      '/sales': SalesPage,
    };
    const path = window.location.pathname;

    if (path.includes('/products/')) {
      return AddProductPage;
    }

    return pages[path];
  }
}