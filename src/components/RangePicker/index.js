import { RANGE } from "../../utils/settings";

export default class RangePicker {
  date = new Date();

  constructor({
    from = new Date(this.date.getFullYear(), this.date.getMonth() - 1, this.date.getDate()),
    to = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 23, 59, 59),
  } = {}) {
    const year = from.getFullYear();
    const month = from.getMonth();
    const day = from.getDate();
  
    this.from = new Date(year, month, 1);
    this.to = new Date(year, month + 1, 1);
    this.selectedDates = {
      from,
      to
    };
    this.isCalendarOpen = false;
    this.locale = 'ru';
  
    this.render();
  }
  
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
      
    this.subElements = this.getSubElements();
    this.setEnentListeners();
  }
  
  setEnentListeners() {
    this.subElements.input.addEventListener('click', this.toggleCalendar);
    this.subElements.selector.addEventListener('click', this.handleClickSelector);
    document.addEventListener('clear-filters', this.handleClearFilters);
  }

  handleClearFilters = () => {
    this.from = RANGE.from;
    this.to = RANGE.to;

    this.selectedDates = {
      from: this.from,
      to: this.to,
    };

    this.update();
  }

  update() {
    this.subElements.input.innerHTML = this.inputTemplate();
    this.element.dispatchEvent(new CustomEvent('date-select', {
      bubbles: true,
      detail: this.selectedDates
    }));
  }
  
  getSubElements() {
    const res = {};
    const elements = this.element.querySelectorAll('[data-element]');
  
    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
  }
  
    toggleCalendar = () => {
      this.element.classList.toggle('rangepicker_open');
      this.isCalendarOpen = !this.isCalendarOpen;
      this.subElements.selector.innerHTML = this.selectorTemplate();
      this.subElements = this.getSubElements();
    }
  
    handleSelectDate(event) {
      if (this.selectedDates.to !== null) {
        this.selectedDates.from = new Date(event.target.dataset.value);
        this.selectedDates.to = null;
  
        event.target.classList.add('rangepicker__selected-from');
      } else {
        event.target.classList.add('rangepicker__selected-to');
        const date = new Date(event.target.dataset.value);

        if (Number(this.selectedDates.from) > Number(date)) {
          this.selectedDates.to = this.selectedDates.from;
          this.selectedDates.from = date;
        } else {
          this.selectedDates.to = date;
        }

        this.selectedDates.to.setHours(23, 59, 59);
        
        this.update();
        this.toggleCalendar();
      }
    }
  
    handleControlMonth(event) {
      const action = {
        left: () => {
          this.from.setMonth(this.from.getMonth() - 1);
          this.to.setMonth(this.to.getMonth() - 1);
        },
        right: () => {
          this.from.setMonth(this.from.getMonth() + 1);
          this.to.setMonth(this.to.getMonth() + 1);
        }
      };
      const way = event.target.className.split('rangepicker__selector-control-')[1];
      action[way]();
      
      this.subElements.selector.innerHTML = this.selectorTemplate();
      this.subElements = this.getSubElements();
    }
  
    handleClickSelector = (event) => {
      if (event.target.dataset.value) {
        this.handleSelectDate(event);
      }
      else if (event.target.className.includes('control')) {
        this.handleControlMonth(event);
      }
    }
  
    getMonthCells(date) {
      const dateFrom = new Date(this.selectedDates.from);
      const dateTo = new Date(this.selectedDates.to);

      const secondsFrom = Number(dateFrom.setHours(0, 0, 0, 0));
      const secondsTo = Number(dateTo.setHours(0, 0, 0, 0));

      const year = date.getFullYear();
      let month = date.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
  
      return new Array(lastDay).fill().map((_, dayNum) => {
        const dateOfDay = new Date(year, month, dayNum + 1);
  
        const getClassName = () => {
          const currentSeconds = Number(dateOfDay);
          let className = 'rangepicker__cell';
  
          if (currentSeconds > secondsFrom && currentSeconds < secondsTo) {className += ' rangepicker__selected-between';}
          else if (currentSeconds === secondsFrom) {className += ' rangepicker__selected-from';}
          else if (currentSeconds === secondsTo) {className += ' rangepicker__selected-to';}
          
          return className;
        };
  
        return `
        <button
          type="button"
          class="${getClassName()}"
          data-value="${dateOfDay.toLocaleDateString('en')}"
          ${dayNum === 0 ? 'style="--start-from:' + dateOfDay.getDay() + '"' : ''}
        >
          ${dayNum + 1}
        </button>
        `;
      }).join("");
    }
  
    getDayNames() {
      return new Array(7).fill().map((_, dayInd) => {
        const date = new Date(2022, 9, dayInd + 3); // 3 Oct 2022 is Monday.
        
        return `<div>${date.toLocaleDateString(this.locale, {weekday: 'short'})}</div>`;
      }).join("");
    }
  
    selectorTemplate() {
      if (!this.isCalendarOpen) {return '';}
      const monthNameFrom = this.from.toLocaleString(this.locale, {month: 'long'});
      const dateFromCopy = new Date(this.from);
      const monthNameNext = new Date(dateFromCopy.setMonth(dateFromCopy.getMonth() + 1)).toLocaleDateString(this.locale, {month: 'long'});
  
      return `
        <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left"></div>
        <div class="rangepicker__selector-control-right"></div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="${monthNameFrom}">${monthNameFrom}</time>
          </div>
          <div class="rangepicker__day-of-week">
            ${this.getDayNames()}
          </div>
          <div class="rangepicker__date-grid">
          ${this.getMonthCells(this.from)}
          </div>
        </div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="${monthNameNext}">${monthNameNext}</time>
          </div>
          <div class="rangepicker__day-of-week">
            ${this.getDayNames()}
          </div>
          <div class="rangepicker__date-grid">
            ${this.getMonthCells(this.to)}
          </div>
        </div>`;
    }
  
    inputTemplate() {
      return `
      <span data-element="from">${this.selectedDates.from.toLocaleDateString(this.locale)}</span> -
      <span data-element="to">${this.selectedDates.to.toLocaleDateString(this.locale)}</span>`;
    }
  
    template() {
      return `
        <div class="rangepicker">
          <div class="rangepicker__input" data-element="input">${this.inputTemplate()}</div>
          <div class="rangepicker__selector" data-element="selector">${this.selectorTemplate()}</div>
        </div>`;
    }
  
    remove() {
      document.removeEventListener('clear-filters', this.handleClearFilters);
      this.element?.remove();
      this.subElements = {};
    }
  
    destroy() {
      this.remove();
    }
}
  