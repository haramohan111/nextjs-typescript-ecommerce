// slices/index.js

import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import subcategoryReducer from './subcategorySlice';
import listsubcategoryReducer from './listsubcategorySlice';
import productReducer from './productSlice';
import colorReducer from './colorSlice';
import sizeReducer from './sizeSlice';
import sellerReducer from './sellerSlice';
import brandReducer from './brandSlice';




const rootReducer = combineReducers({
  categoryreducer: categoryReducer,
  subcategoryreducer: subcategoryReducer,
  listsubcategoryreducer: listsubcategoryReducer,
  productreducer: productReducer,
  colorreducer:colorReducer,
  sizereducer:sizeReducer,
  sellerreducer:sellerReducer,
  brandreducer:brandReducer

});

export default rootReducer;
