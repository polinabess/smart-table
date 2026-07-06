import { createComparison, defaultRules } from "../lib/compare.js";

// Создаём компаратор один раз с правилами по умолчанию
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const select = elements[elementName];
        if (select && select.tagName === 'SELECT') {
            // Добавляем опции из индекса
            const options = Object.values(indexes[elementName]).map(name => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                return option;
            });
            select.append(...options);
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля (кнопка clear)
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field; // 'date' или 'customer'
            if (fieldName) {
                // Ищем родительский контейнер с классом filter-wrapper и поле ввода внутри
                const wrapper = action.closest('.filter-wrapper');
                if (wrapper) {
                    const input = wrapper.querySelector('input');
                    if (input) {
                        input.value = ''; // сброс значения в DOM
                    }
                }
                // Сбрасываем значение в состоянии
                if (state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
            }
        }

        // Обработка кнопки сброса всех фильтров (reset)
        if (action && action.name === 'reset') {
            // Перебираем все элементы фильтрации
            Object.keys(elements).forEach((key) => {
                const el = elements[key];
                const nameAttr = el.getAttribute('name');
                if (nameAttr) {
                    // Сбрасываем соответствующее поле в state
                    if (state[nameAttr] !== undefined) {
                        state[nameAttr] = '';
                    }
                }
                // Сбрасываем значение в DOM
                if (el.tagName === 'INPUT') {
                    el.value = '';
                } else if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0; // выбираем первый (пустой) option
                }
            });
            // total пересчитывается в collectState, поэтому дополнительных действий не требуется
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}