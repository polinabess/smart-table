import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            // Добавляем пустой option для сброса
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = "";
            elements[elementName].append(emptyOption);

            // Остальные опции
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
            const fieldName = action.dataset.field;   // имя поля в state
            if (fieldName) {
                // Находим родительский контейнер и поле ввода
                const parent = action.closest('.filter-wrapper') || action.parentElement;
                const input = parent?.querySelector('input');
                if (input) input.value = '';
                if (state[fieldName] !== undefined) state[fieldName] = '';
            }
        }

        // Обработка кнопки сброса всех фильтров (reset)
        if (action && action.name === 'reset') {
            // Сбрасываем все поля фильтрации в state и в DOM
            Object.keys(elements).forEach(elementName => {
                const el = elements[elementName];
                const nameAttr = el.getAttribute('name');
                if (nameAttr) {
                    if (state[nameAttr] !== undefined) {
                        state[nameAttr] = '';
                    }
                }
                // Сбрасываем значение элемента
                if (el.tagName === 'INPUT') {
                    el.value = '';
                } else if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0;   // выбираем пустой option
                }
            });
            // Удаляем total, чтобы не мешал
            state.total = undefined;
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}