import {createContext, ReactNode, useCallback} from 'react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {useLogin} from "@/hooks/users/useUsers";
import {ReqLogin, ResLogin, ResLoginUser} from "@/hooks/users/model";
import Cookies from "js-cookie";
import {COOKIES} from "@/utils/cookies";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store/store";
import {setUser} from "@/store/slices/authSlice";
import {UseMutationResult} from "@tanstack/react-query";
import {toast} from "sonner";
import {ResRequest} from "@/hooks/model";

type CallbackLoginFuncProps = {
    onSuccess?: (res: ResLogin) => void
    onError?: (error: Error) => void
}

interface AuthContextType {
    loginMutation: UseMutationResult<ResRequest<ResLogin>, Error, ReqLogin, unknown>,
    token?: string;

    login: (data: ReqLogin, callbacks?: CallbackLoginFuncProps) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();

    const loginMutation = useLogin();

    const dispatch = useDispatch<AppDispatch>();

    const initializeToken = useCallback((user: ResLoginUser, token: string) => {
        dispatch(setUser({
            token: token,
            user: user
        }));
        Cookies.set(COOKIES.TOKEN, token);
    }, [dispatch]);

    const clearToken = useCallback(() => {
        dispatch(setUser(null));
        Cookies.remove(COOKIES.TOKEN);
    }, [dispatch]);

    const login = useCallback((data: ReqLogin, callbacks?: CallbackLoginFuncProps) => {
        loginMutation.mutate(data, {
            onSuccess: (res) => {
                const {data} = res;
                if (data.token) {
                    // Store token and user data
                    initializeToken(data.user, data.token);

                    // Show success message
                    toast.success("Login successful");

                    // Navigate to home page
                    navigate(ROUTES.HOME);

                    // Call success callback if provided
                    callbacks?.onSuccess?.(data);
                } else {
                    toast.error("Login failed: No token received");
                }
            },
            onError: (error) => {
                console.error("Login error:", error);

                // Show error message
                toast.error(error.message || "Login failed. Please try again.");

                // Call error callback if provided
                callbacks?.onError?.(error);
            }
        });
    }, [initializeToken, loginMutation, navigate]);

    const logout = useCallback(() => {
        clearToken();
        navigate(ROUTES.LOGIN);
    }, [clearToken, navigate]);

    const value: AuthContextType = {
        // variable
        loginMutation,

        // function
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthProvider, AuthContext};