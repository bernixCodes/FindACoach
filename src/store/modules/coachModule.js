import axios from 'axios'

export default {
    namespaced: true,
    state() {
        return {
            lastFetch: null,
            coaches: [
                {
                    id: 'c1',
                    firstName: 'Adjoa',
                    lastName: 'Greatly',
                    areas: ['frontend', 'backend', 'career'],
                    description:
                        "I'm Adjoa B and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
                    hourlyRate: 30
                },
                {
                    id: 'c2',
                    firstName: 'Kofi',
                    lastName: 'Godfred',
                    areas: ['frontend', 'career'],
                    description:
                        'I am Kofi and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
                    hourlyRate: 30
                }
            ]
        }
    },
    getters: {
        coaches(state) {
            return state.coaches

        },
        hasCoaches(state) {
            return state.coaches && state.coaches.length > 0
        },
        isCoach(_, getters, _2, rootGetters) {
            const coaches = getters.coaches;
            const userId = rootGetters.userId;
            return coaches.some(coach => coach.id === userId)
        },
        shouldUpdate(state) {
            const lastFetch = state.lastFetch;
            if (!lastFetch) {
                return true
            }
            const currentTimestamp = new Date().getTime();
            return (currentTimestamp - lastFetch) / 1000 > 60
        }
    },

    mutations: {
        registerCoach(state, payload) {
            // state.coaches.push(payload)
            state.coaches = [...state.coaches, payload];
        },
        setCoaches(state, payload) {
            state.coaches = payload;
        },
        setFetchTimestamp(state) {
            state.lastFetch = new Date().getTime();
        }
    },

    actions: {
        async registerCoach(context, data) {
            const userId = context.rootGetters.userId;
            const coachData = {
                firstName: data.firstName,
                lastName: data.lastName,
                description: data.description,
                hourlyRate: data.hourlyRate,
                areas: data.areas,
            }
            const token = context.rootGetters.token;
            await axios.put(`https://find-a-coach-app-545f1-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` + token, {
                coachData
            })
            context.commit('registerCoach', {
                ...coachData,
                id: userId
            })
        },

        async loadCoaches(context, payload) {
            if (!payload.forceRefresh && !context.getters.shouldUpdate) {
                return;
            }
            await axios.get('https://find-a-coach-app-545f1-default-rtdb.firebaseio.com/coaches.json')
                .then(response => {
                    let coaches = [];

                    for (const key in response.data) {

                        let coach = response.data[key].coachData;
                        coach.id = key;
                        coaches.push(coach)
                    }
                    context.commit('setCoaches', coaches);
                    context.commit('setFetchTimestamp')
                })
                .catch(error => {
                    // const response = error.response.data;
                    new Error("Failed to fetch");
                    throw error;
                })

        }
    }


}