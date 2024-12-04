// types/categoryTypes.ts

export interface Category {
    _id: string;
    name: string;
    status: number;
    category_id:{
        name:string;
    };
}

export interface CategoryState {
    subcategories: {
        result: Category[];
        pageCount: number;
        pageindex: number;
        length:number;
    };
    status: string;
    error: string;
    loading: boolean;
}

export interface subcategoryRootState {
    subcategoryreducer: CategoryState;
}
