import CookieUtils from "../utils/cookieUtil";
import Axios from "@/common/axios.js";

const state = {
  user_info: null,
  access_token: "",
  role: null,
  pdfLoading: null
};

const getters = {
  getUserInfo: state => state.user_info || {},
  getAccessToken: state => {
    if (!state.access_token) {
      // 从cookies中拿到
      state.access_token = CookieUtils.get("ACCESS_TOKEN_MANAGER");
    }
    return state.access_token;
  },
  getRole: state => state.role,
};

const mutations = {
  UPDATE_USER_INFO(state, user_info) {
    state.user_info = user_info;
  },
  REMOVE_USER_INFO(state) {
    state.user_info = null;
  },
  UPDATE_ACCESS_TOKEN(state, param) {
    state.access_token = param.access_token;
    CookieUtils.set({
      key: "ACCESS_TOKEN_MANAGER",
      value: param.access_token,
      expires: param.rememberMe ? 7 : null,
    });
  },
  REMOVE_ACCESS_TOKEN(state) {
    state.access_token = "";
    CookieUtils.remove({
      key: "ACCESS_TOKEN_MANAGER",
    });
  },
  UPDATE_USER_ROLE(state, role) {
    state.role = role;
  },
  REMOVE_USER_ROLE(state) {
    state.role = null;
  },
  PDF_LOAD(state, val) {
    state.pdfLoading = val
  }
};

const actions = {
  // incrementIfOddOnRootSum ({ state, commit, rootState }) {
  //   console.log(rootState)
  //   commit('INCREMENT')
  // },
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.user_info) {
        resolve(state.user_info);
      } else {
        Axios.post("/api/upms/user/getUserInfo")
          .then(data => {
            commit("UPDATE_USER_INFO", data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  },
  getUserRoles({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.role) {
        resolve(state.role);
      } else {
        Axios.post("/api/upms/role/getUserRoles")
          .then(data => {
            commit("UPDATE_USER_ROLE", data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  },
  updateUserInfo({ commit }, user_info) {
    commit("UPDATE_USER_INFO", user_info);
  },
  updateAccessToken({ commit }, param) {
    commit("UPDATE_ACCESS_TOKEN", param);
  },
  removeAccessToken({ commit }) {
    commit("REMOVE_ACCESS_TOKEN");
  },
  logout({ commit }) {
    commit("REMOVE_USER_INFO");
    commit("REMOVE_USER_ROLE");
    commit("REMOVE_ACCESS_TOKEN");
  },
  padLoad({ commit }, val) {

    commit("PDF_LOAD", val);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
