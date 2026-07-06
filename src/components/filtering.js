import { createComparison, defaultRules } from "../lib/compare.js";

// Настраиваем компаратор (используем defaultRules)
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            const options = Object.values(indexes[elementName]).map(name => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                return option;
            });
            elements[elementName].append(...options);
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля (кнопка clear)
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            if (fieldName) {
                // Находим родительский контейнер и поле ввода
                const parent = action.closest('.filter-group') || action.parentElement;
                const input = parent?.querySelector('input');
                if (input) {
                    input.value = '';
                }
                // Сбрасываем в state
                if (state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
            }
        }

        // Обработка кнопки сброса всех фильтров (reset)
        if (action && action.name === 'reset') {
            // Список полей, которые нужно сбросить (все фильтры)
            const filterFields = ['date', 'customer', 'seller', 'totalFrom', 'totalTo'];
            filterFields.forEach(field => {
                if (state[field] !== undefined) {
                    state[field] = '';
                }
                // Сбрасываем DOM-элементы
                const el = elements[field] || elements[`searchBy${field}`] ; // на случай других имён
                if (el) {
                    if (el.tagName === 'INPUT') {
                        el.value = '';
                    } else if (el.tagName === 'SELECT') {
                        el.selectedIndex = 0;
                    }
                }
            });
            // Также удаляем поле total, чтобы не мешало
            state.total = undefined;
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}