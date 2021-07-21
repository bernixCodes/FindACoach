import { createStore } from "vuex";
import coachModule from "./modules/coachModule";
import requestModules from "./modules/requestModules";

const store = createStore({
    modules: {
        coaches: coachModule,
        requests: requestModules
    },
    state() {
        return {
            userId: 'c2'
        }
    },
    getters: {
        userId(state) {
            return state.userId
        }
    }
})

export default store;