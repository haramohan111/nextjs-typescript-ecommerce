// types/categoryTypes.ts

export interface Category {
    _id: string;
    name: string;
    status: number;
}

export interface CategoryState {
    categories: {
        result: Category[];
        pageCount: number;
        pageindex: number;
    };
    status: string;
    error: string;
    loading: boolean;
}

export interface categoryRootState {
    categoryreducer: CategoryState;
}
