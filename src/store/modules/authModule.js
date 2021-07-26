import axios from "axios";
export default {
    state() {
        return {
            userId: null,
            token: null,
            tokenExpiration: null
        }
    },
    getters: {
        userId(state) {
            return state.userId
        }
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.userId = payload.userId;
            state.tokenExpiration = payload.tokenExpiration;
        }
    },
    actions: {
        login() { },
        async signup(context, payload) {
            try {
                const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTuBzBBgz-hgAtql0_sq_RAWedewuFEKQ', {
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
                console.log(response)
                context.commit('setUser', {
                    token: response.data.idToken,
                    userId: response.data.localId,
                    tokenExpiration: response.data.expiresIn
                })
            }
            catch (error) {
                new Error("Something went wrong");
                throw error;
            }

        }

    }

}