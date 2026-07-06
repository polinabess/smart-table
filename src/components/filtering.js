import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
        .forEach((elementName) => {                        // Перебираем по именам
            elements[elementName].append(                    // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                        .map(name => {                        // используйте name как значение и текстовое содержимое
                            const element = document.createElement("option");
                            element.textContent = name;
                            element.value = name;                             // @todo: создать и вернуть тег опции
                        })
            )
        })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            if (fieldName) {
                // Находим родительский контейнер кнопки и внутри него — поле ввода
                const parent = action.parentElement;
                const input = parent.querySelector('input');
                if (input) {
                    input.value = '';          // сброс значения в DOM
                }
                // Сброс значения в состоянии
                if (state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}