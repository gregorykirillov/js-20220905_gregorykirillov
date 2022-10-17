export default [
  {
    id: 'images',
    title: 'Фото',
    sortable: false,
    template: data => {
      return `
          <div class="sortable-table__cell">
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
        </div>
        `;}
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
    id: 'sales',
    title: 'Продажи',
    sortable: true,
    sortType: 'number'
  },
];