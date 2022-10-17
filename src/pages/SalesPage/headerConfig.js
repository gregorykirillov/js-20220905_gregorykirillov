export default [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number',
  },
  {
    id: 'user',
    title: 'Клиент',
    sortable: true,
    sortType: 'string',
  },
  {
    id: 'createdAt',
    title: 'Дата',
    sortable: true,
    preSorting: true,
    order: 'desc',
    sortType: 'string',
    template: date => `<div class="sortable-table__cell">
        ${(new Date(date).toLocaleString('ru', {day: 'numeric', month: 'short', year: 'numeric'}))}
      </div>`
  },
  {
    id: 'totalCost',
    title: 'Стоимость',
    sortable: true,
    sortType: 'number',
    template: price => `<div class="sortable-table__cell">
      ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(price)}
    </div>`
  },
  {
    id: 'delivery',
    title: 'Статус',
    sortable: true,
    sortType: 'number',
  },
];