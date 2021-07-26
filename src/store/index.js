import { createStore } from "vuex";
import coachModule from "./modules/coachModule";
import requestModules from "./modules/requestModules";
import authModule from "./modules/authModule";

const store = createStore({
    modules: {
        coaches: coachModule,
        requests: requestModules,
        auth: authModule
    },


})

export default store;