import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import topMenuReducer from '@/redux/slices/topMenuSlice';
import dealOfTheDayReducer from '@/redux/slices/dealofthedaySlice';
import productsForMenReducer from '@/redux/slices/productsForMenSlice';
import productsForWomenReducer from '@/redux/slices/productsForWomenSlice';
import productReducer from '@/redux/slices/fetchProductbyIDslice';
import cartReducer from '@/redux/slices/cartSlice';
import loginReducer from '@/redux/slices/loginSlice';
import signupReducer from '@/redux/slices/signupSlice';
import verificationReducer from '@/redux/slices/verificationSlice';
import searchReducer from '@/redux/slices/searchSlice';
import gridProductReducer from '@/redux/slices/gridProductSlice';
import orderReducer from "@/redux/slices/orderSlice";
import wishlistReducer from '@/redux/slices/wishlistSlice';
import todaysFavoriteReducer from '@/redux/slices/todayfavSlice';
import accessoriesReducer from '@/redux/slices/accessoriesSlice';

const rootReducer = combineReducers({
  form: formReducer,
  topMenu: topMenuReducer,
  dealOfTheDay: dealOfTheDayReducer,
  productsForMen: productsForMenReducer,
  productsForWomen: productsForWomenReducer,
  product: productReducer,
  cart: cartReducer,
  auth: loginReducer,
  signup: signupReducer,
  verification: verificationReducer,
  search: searchReducer,
  gridProduct: gridProductReducer, 
  order: orderReducer,
  wishlist: wishlistReducer,
  todaysFavorite: todaysFavoriteReducer,
  accessories: accessoriesReducer,
});

export default rootReducer;