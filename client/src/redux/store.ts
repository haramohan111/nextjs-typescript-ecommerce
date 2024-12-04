import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers';


export const store = configureStore({
  
    reducer: rootReducer,
    
})

// Define RootState type based on the store
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;


