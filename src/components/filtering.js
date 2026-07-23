export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
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

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}