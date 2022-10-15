import {CategoriesPage, DashboardPage, ProductPage, SalesPage} from '../../pages';
import { Tooltip } from '../../components';
import {leftBarTemplate} from './templates';

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
  }

  handleCollapseSidebar() {
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
    const buttonsList = event.target.closest('ul');

    [...buttonsList.children].forEach(el => el.classList.remove('active'));
  }

  setButtonActive(event) {
    const button = event.target.closest('li');
    if (!button) {return;}

    this.clearActiveButton(event);
    button.classList.add('active');
  }

  handleChangePage = async (event) => {
    event.preventDefault();

    this.setButtonActive(event);

    const pageButton = event.target.closest('[data-page]');
    if (!pageButton) {return;}

    const path = pageButton.dataset.page;
    window.history.pushState(null, null, path);
    
    const renderedPage = await this.renderPage();
    this.content.innerHTML = '';
    this.content.append(renderedPage);
  }

  getPageByLocation() {
    const pages = {
      '/': DashboardPage,
      '/dashboard': DashboardPage
    };
    const path = window.location.pathname;

    return pages[path];
  }
}