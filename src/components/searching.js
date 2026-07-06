import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    const comparator = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        const searchValue = state[searchField] || '';
        if (!searchValue) return data;
        return data.filter(item => comparator(item, { [searchField]: searchValue }));
    };
}