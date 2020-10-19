/**
 * @file Store
 * @author liule
 * @since 2019.05.01
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        codeL: '',
        token: '',
        needBindPhone: false,
        userInfo: {}
    },
    mutations: {
        setCode: (state, payload) => {
            state.code = payload;
        },
        setToken: (state, payload) => {
            state.token = payload;
        },
        setNeedBindPhone: (state, payload) => {
            state.needBindPhone = payload;
        },
        setUserInfo: (state, payload) => {
            state.userInfo = payload;
        }
    }
});
