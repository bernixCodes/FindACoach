import axios from 'axios'

export default {
    namespaced: true,
    state() {
        return {
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
        }
    },

    mutations: {
        registerCoach(state, payload) {
            // state.coaches.push(payload)
            state.coaches = [...state.coaches, payload];
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
            await axios.put(`https://find-a-coach-app-545f1-default-rtdb.firebaseio.com/coaches/${userId}.json`, {
                coachData
            })
            context.commit('registerCoach', {
                ...coachData,
                id: userId
            })
        }
    }


}