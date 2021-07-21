import axios from "axios";
export default {
    namespaced: true,
    state() {
        return {
            requests: []
        }
    },
    getters: {
        requests(state, _, _2, rootGetters) {
            const coachId = rootGetters.userId;
            return state.requests.filter(request => request.coachId === coachId)
        },
        hasRequests(_, getters) {
            return getters.requests && getters.requests.length > 0
        }
    },
    mutations: {
        addRequest(state, payload) {
            state.requests.push(payload)
        },
        setRequests(state, payload) {
            state.requests = payload
        }
    },
    actions: {
        async contactCoach(context, payload) {
            const newRequest = {
                userEmail: payload.email,
                message: payload.message
            }
            const response = await axios.post(`https://find-a-coach-app-545f1-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
                newRequest
            )
            // console.log(response);
            newRequest.id = response.data.name;
            newRequest.coachId = payload.coachId;
            context.commit('addRequest', newRequest)
        },

        async fetchRequests(context) {
            const coachId = context.rootGetters.userId;
            await axios.get(`https://find-a-coach-app-545f1-default-rtdb.firebaseio.com/requests/${coachId}.json`)
                .then(response => {
                    let requests = [];

                    for (const key in response.data) {
                        const request = {
                            id: key,
                            coachId: coachId,
                            userEmail: response.data[key].userEmail,
                            message: response.data[key].message
                        }
                        requests.push(request)
                    }
                    context.commit('setRequests', requests)
                })
                .catch(error => {
                    // const response = error.response.data;
                    new Error("Failed to fetch");
                    throw error;
                })

        }
    }

}