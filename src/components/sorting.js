import {sortMap} from "../lib/sort.js"; // sortCollection больше не нужен

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        // Если действие – это нажатие на кнопку сортировки
        if (action && action.name === 'sort') {
            // @todo: #3.1 – переключить состояние сортировки по кругу
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            // @todo: #3.2 – сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 – получить выбранный режим сортировки при перерисовке (без действия)
            columns.forEach(column => {
                if (column.dataset.value && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }
        
        const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    }
}