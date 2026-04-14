import { initialCategories } from "./categories";

export const mongoCategories = initialCategories.map((c) => {
    const { id, _id, ...cleanCategory } = c as any;

    return {
        ...cleanCategory
    };
});