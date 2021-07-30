import axios from "axios";
let timer;
export default {
    state() {
        return {
            userId: null,
            token: null,
            didAutoLogout: false
        }
    },
    getters: {
        userId(state) {
            return state.userId
        },
        token(state) {
            return state.token
        },
        isAuthenticated(state) {
            return !!state.token
        },
        didAutoLogout(state) {
            return state.didAutoLogout
        }
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.userId = payload.userId;
            state.didAutoLogout = false;
        },
        setAutoLogout(state) {
            state.didAutoLogout = true;
        }
    },
    actions: {
        async login(context, payload) {
            return context.dispatch('auth', {
                ...payload,
                mode: 'login'
            })

        },
        async signup(context, payload) {
            return context.dispatch('auth', {
                ...payload,
                mode: 'signup'
            })

        },
        async auth(context, payload) {
            try {
                const mode = payload.mode;
                let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDTuBzBBgz-hgAtql0_sq_RAWedewuFEKQ';
                if (mode === 'signup') {
                    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTuBzBBgz-hgAtql0_sq_RAWedewuFEKQ'
                }

                const response = await axios.post(url, {
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
                const expiresIn = +response.data.expiresIn * 1000;
                const expirationDate = new Date().getTime() + expiresIn;

                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('userId', response.data.localId);
                localStorage.setItem('tokenExpiration', expirationDate);

                timer = setTimeout(function () {
                    context.dispatch('autoLogout')
                }, expiresIn)
                context.commit('setUser', {
                    token: response.data.idToken,
                    userId: response.data.localId,
                    tokenExpiration: expirationDate
                })
            }
            catch (error) {
                new Error("Something went wrong");
                throw error;
            }
        },
        tryLogin(context) {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tokenExpiration = localStorage.getItem('tokenExpiration')

            const expiresIn = +tokenExpiration - new Date().getTime();
            if (expiresIn < 0) {
                return;
            }
            timer = setTimeout(function () {
                context.dispatch('autoLogout')
            }, expiresIn)
            if (token && userId) {
                context.commit('setUser', {
                    token: token,
                    userId: userId,
                })
            }
        },
        logout(context) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId')
            localStorage.removeItem('tokenExpiration')

            clearTimeout(timer);
            context.commit('setUser', {
                token: null,
                userId: null,
            })
        },
        autoLogout(context) {
            context.dispatch('logout');
            context.commit('setAutoLogout')
        }

    }

}