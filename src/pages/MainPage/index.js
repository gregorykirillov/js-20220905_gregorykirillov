import {AddProductPage, CategoriesPage, DashboardPage, ProductPage, SalesPage} from '@/pages';
import { Notification, Tooltip } from '@/components';
import {leftBarTemplate} from './templates';
import { NOTIFICATION_EVENT } from '@/utils/settings';

export default class Page {
  constructor() {
    if (!!Page.instance) {
      return Page.instance;
    }

    Page.instance = this;
    
    return this;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = leftBarTemplate();
    this.components = {};
    document.body.append(element.firstElementChild);

    this.element = element.firstElementChild;
    this.content = document.querySelector('#content');
  
    this.components.tooltip = new Tooltip();
    this.components.tooltip.initialize();

    const renderedPage = await this.renderPage();
    this.content.append(renderedPage);
    this.setButtonActive();
    
    this.setEventListeners();

    return this.element;
  }

  async renderPage() {
    const Page = this.getPageByLocation();
    const page = new Page();
    this.previousPage = page;

    const renderedPage = await page.render();

    return renderedPage;
  }

  setEventListeners() {
    document.querySelector('.sidebar__nav').addEventListener('click', this.handleChangePage);
    document.querySelector('button.sidebar__toggler').addEventListener('click', this.handleCollapseSidebar);
    
    document.addEventListener(NOTIFICATION_EVENT, this.handleNotifications);

    window.addEventListener('load', this.handleLoaded);
  }

  handleNotifications = (event) => {
    const {message, type} = event.detail;

    this.components.notification = new Notification(message, {
      type,
      duration: 2000,
    });
    this.components.notification.show();

    document.body.append(this.components.notification.element);
  }

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

  removePreviousPage() {
    this.previousPage?.remove();
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
    
    this.removePreviousPage();
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
      '/products/': AddProductPage,
      '/categories': CategoriesPage,
      '/sales': SalesPage,
    };
    const path =
      window.location.pathname.split('/products/')[1]
        ? '/products/'
        : window.location.pathname;

    return pages[path];
  }

  removeComponents() {
    Object.entries(this.components).forEach(([_, component]) => component.remove());
  }

  remove() {
    this.element.remove();
    this.element = null;    
    this.removeComponents();
  }
}