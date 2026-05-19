import axios, { AxiosInstance } from "axios";
import Config from "react-native-config";
import { store } from "../store";
import { setCredentials, logout } from "../store/slices/authSlice";
import logger from "../utils/logger";
import { resetChat, resetTimeline } from "../store/slices/chatSlice";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

class BaseClient {
    static client = (): AxiosInstance => {
        const instance = axios.create({
            baseURL: Config.BASE_URL,
        });

        // REQUEST INTERCEPTOR
        instance.interceptors.request.use(
            config => {
                const token = store.getState().auth.token;
                
                // Define endpoints that should NOT have an Authorization header
                const publicEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh'];
                const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

                logger.log(`Checking if ${config.url} is public:`, isPublic, "Token exists:", !!token);

                if (token && !isPublic) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Fix: Force multipart/form-data for FormData to prevent urlencoded default
                if (config.data instanceof FormData) {
                    config.headers['Content-Type'] = 'multipart/form-data';
                }

                logger.log("Request:", {
                    address: `${config.baseURL}${config.url}`,
                    isPublic,
                    requestBody: config.data,
                    headers: config.headers,
                    params: config.params,
                });

                return config;
            },
            error => Promise.reject(error),
        );

        // RESPONSE INTERCEPTOR
        instance.interceptors.response.use(
            response => {
                logger.log("Response:", response.data);
                return response;
            },
            async error => {
                const originalRequest = error.config;

                // Skip refresh token flow for auth endpoints
                const isAuthEndpoint = originalRequest.url?.includes('/auth/');
                const isMeEndpoint = originalRequest.url?.includes('/auth/me');
                const isResetEndpoint = originalRequest.url?.includes('/auth/reset-password');
                const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');

                const isAuthUrl = isAuthEndpoint && !isRefreshEndpoint && !isMeEndpoint && !isResetEndpoint
                console.log('isAuthUrl', isAuthUrl);


                // Don't try to refresh token for login or register endpoints
                if (isAuthEndpoint && !isRefreshEndpoint && !isMeEndpoint && !isResetEndpoint) {
                    logger.log("Auth endpoint failed, not attempting token refresh");
                    return Promise.reject(error);
                }

                // Check if it's a 401 error and not already retried
                if (error.response?.status === 401 && !originalRequest._retry) {

                    // Prevent multiple refresh attempts
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        }).then((token: any) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return instance(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const state = store.getState().auth;
                        const refreshToken = state.refreshToken;

                        // Check if refresh token exists
                        if (!refreshToken) {
                            logger.log("No refresh token available, logging out");
                            store.dispatch(logout());
                            store.dispatch(resetChat());
                            store.dispatch(resetTimeline());
                            return Promise.reject(error);
                        }

                        const response = await ClientInstance.post(
                            `/auth/refresh`, // Remove baseURL duplication
                            { refreshToken }
                        );

                        const user = state.user;
                        if (response.status === 200) {
                            store.dispatch(
                                setCredentials({
                                    token: response.data.access_token,
                                    refreshToken: response.data.refresh_token,
                                    validTill: response.data.expires_in,
                                    refreshValidTill: response.data.refresh_expires_in,
                                    user: user!,
                                }),
                            );

                            processQueue(null, response.data.access_token);
                            logger.log('token refreshed>>');

                            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

                            return instance(originalRequest);
                        } else {
                            throw new Error("Refresh token failed");
                        }

                    } catch (err) {
                        processQueue(err, null);
                        logger.error('refresh token failed>>>', err);
                        store.dispatch(logout());
                        store.dispatch(resetChat());
                        store.dispatch(resetTimeline());
                        return Promise.reject(err);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            },
        );

        return instance;
    };
}

const ClientInstance = BaseClient.client();

export { ClientInstance };