import {configureStore} from "@reduxjs/toolkit";

import {ENV, ENV_PRODUCTION} from "@/utils/env";
import authReducer from "@/store/slices/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer, // Thêm các slice vào đây
    },
    devTools: ENV.NODE_ENV === ENV_PRODUCTION, // Bật Redux DevTools khi không ở production
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

