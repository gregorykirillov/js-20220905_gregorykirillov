import {SortableList} from '../../components';

import fetchJson from '../../utils/fetch-json';
import { API_URL_REST, BACKEND_URL, NOTIFICATION_EVENT, ORDER_ITEMS_CHANGED } from '../../utils/settings';

export default class Page {
  template() {
    return `
      <div class='categories'>
        <div class='content__top-panel'>
          <h2 class='page-title'>Категории товаров</h2>
        </div>
        <p>Подкатегории можно перетаскивать, меняя их порядок внутри своей категории.</p>
        <div data-element="categoriesContainer"></div>
      </div>
    `;
  }

  renderCategories() {
    const element = document.createElement('div');

    element.innerHTML = this.data.map(category => {
      return `
        <div class="category category_open" data-id="${category.id}">
          <header class="category__header">
            ${category.title}
          </header>
          <div class="category__body">
            <div class="subcategory-list" data-element="subcategoryList">
            </div>
          </div>
        </div>
      `;}).join('');
      
    this.data.map(category => {
      this.appendCategories(category.subcategories, element, category.id);
    });

    this.container.append(...element.childNodes);
  }

  getData() {
    const url = new URL(`${API_URL_REST}/categories`, BACKEND_URL);

    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');

    return fetchJson(url);
  }

  async setData() {
    const data = await this.getData();
    
    this.data = data;
  }

  appendCategories(data, element, id) {
    this.components.subcategories = new SortableList({
      items: data.map(subcategory => {
        const element = document.createElement('li');
        element.innerHTML = this.categoryRowTemplate(subcategory);
  
        return element.firstElementChild;
      })
    });
    
    const el = element.querySelector(`[data-id="${id}"] [data-element="subcategoryList"]`);
    el.append(this.components.subcategories.element);
  }

  categoryRowTemplate(subcategory) {
    return `
      <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${subcategory.id}">
        <strong>${subcategory.title}</strong>
        <span><b>${subcategory.count}</b> products</span>
      </li>
    `;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
    this.components = {};

    this.container = this.element.querySelector('[data-element="categoriesContainer"]');

    await this.setData();
    this.renderCategories();

    this.setEventListeners();

    return this.element;
  }

  onClickContainer = (event) => {
    const header = event.target.closest('header');
    if (!header) {return;}

    header.closest('.category').classList.toggle('category_open');
  }

  async sendNewData(data) {
    try {
      const url = new URL(`${API_URL_REST}/subcategories`, BACKEND_URL);

      await fetchJson(url, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "Application/json",
        }
      });

      this.element.dispatchEvent(
        new CustomEvent(NOTIFICATION_EVENT, {
          bubbles: true,
          detail: {
            message: 'Категории успешно сохранены',
          },
        })
      );
    } catch (error) {
      console.error(error);
      this.element.dispatchEvent(
        new CustomEvent(NOTIFICATION_EVENT, {
          bubbles: true,
          detail: {
            message: 'Ошибка при сохранении категорий',
            type: 'error',
          },
        })
      );
    }
  }

  updateData(element) {
    const data = Array.from(element.childNodes).map((node, ind) => {
      return {
        id: node.dataset.id,
        weight: ind
      };
    });

    this.sendNewData(data);
  }

  onOrderChanged = (event) => {
    const changedElementId = event.detail;
    const changedElement = document.querySelector(`[data-id="${changedElementId}"] [data-element="itemList"]`);

    this.updateData(changedElement);
  }

  setEventListeners() {
    this.container.addEventListener('click', this.onClickContainer);
    this.container.addEventListener(ORDER_ITEMS_CHANGED, this.onOrderChanged);
  }

  removeComponents() {
    Object.entries(this.components).forEach(([_, component]) => component.remove());
  }

  remove() {
    this.element?.remove();
    this.removeComponents();
  }

  destroy() {
    this.remove();
  }
}