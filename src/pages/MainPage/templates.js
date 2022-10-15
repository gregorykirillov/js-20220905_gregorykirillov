export const leftBarTemplate = () => {
  return `
    <main class='main'>
        <div class='progress-bar'>
            <div class='progress-bar__line'></div>
        </div>
        <aside class='sidebar'>
            <h2 class='sidebar__title'>
            <a href='/'>shop admin</a>
            </h2>
            <ul class='sidebar__nav'>
            <li>
                <a href='/' data-page='dashboard'>
                <i class='icon-dashboard'></i> <span>Панель управления</span>
                </a>
            </li>
            <li>
                <a href='/products' data-page='products'>
                <i class='icon-products'></i> <span>Товары</span>
                </a>
            </li>
            <li>
                <a href='/categories' data-page='categories'>
                <i class='icon-categories'></i> <span>Категории</span>
                </a>
            </li>
            <li>
                <a href='/sales' data-page='sales'>
                <i class='icon-sales'></i> <span>Продажи</span>
                </a>
            </li>
            </ul>
            <ul class='sidebar__nav sidebar__nav_bottom'>
            <li>
                <button type='button' class='sidebar__toggler'>
                <i class='icon-toggle-sidebar'></i> <span>Скрыть панель</span>
                </button>
            </li>
            </ul>
        </aside>
        <section class='content' id='content'>
        
        </section>
    </main>`;
};