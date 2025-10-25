import { setIsLoading, setError } from "../constants";
import axios, { SOCIETY_ACCOUNT_URL } from "../api";
import { commitError, stopLoadingAndResolve } from "./app";

export default {
  namespaced: true,

  state: {
    isLoading: false,
    error: null,
  },

  getters: {
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
  },

  mutations: {
    [setIsLoading]: (state, isLoading) => (state.isLoading = isLoading),
    [setError]: (state, error) => (state.error = error),
  },

  actions: {
    // 🔹 Get all society accounts
    getSocietyAccount({ commit }) {
      commit(setIsLoading, true);

      return axios
        .get(SOCIETY_ACCOUNT_URL.index)
        .then((resp) => {
          const { success, data } = resp.data;
          if (success) {
            return { accounts: data.accounts, totals: data.totals }; // backend returns { accounts }
          }
        })
        .catch((e) => commitError(commit, e))
        .then((data) => stopLoadingAndResolve(commit, data));
    },

    // 🔹 Get details of a single account (with transactions)
    getSocietyAccountDetail({ commit }, id) {
      commit(setIsLoading, true);

      return axios
        .get(`${SOCIETY_ACCOUNT_URL.show}/${id}`)
        .then((resp) => {
          const { success, data } = resp.data;
          if (success) {
            return { account: data }; // backend returns full account with society + transactions
          }
        })
        .catch((e) => commitError(commit, e))
        .then((data) => stopLoadingAndResolve(commit, data));
    },

    deposit({ commit }, { society_id, amount }) {
      commit(setIsLoading, true);

      return axios
        .post(`${SOCIETY_ACCOUNT_URL.deposit}/${society_id}/deposit`, { amount })
        .then((resp) => resp.data) // return { success, msg }
        .catch((e) => {
          commitError(commit, e);
          return { success: false, msg: e?.response?.data?.msg || e.message };
        })
        .finally(() => commit(setIsLoading, false));
    },

    withdraw({ commit }, { society_id, amount }) {
      commit(setIsLoading, true);

      return axios
        .post(`${SOCIETY_ACCOUNT_URL.withdraw}/${society_id}/withdraw`, { amount })
        .then((resp) => resp.data)
        .catch((e) => {
          commitError(commit, e);
          return { success: false, msg: e?.response?.data?.msg || e.message };
        })
        .finally(() => commit(setIsLoading, false));
    },

    borrow({ commit }, { society_id, amount }) {
      commit(setIsLoading, true);

      return axios
        .post(`${SOCIETY_ACCOUNT_URL.borrow}/${society_id}/borrow`, { amount })
        .then((resp) => resp.data)
        .catch((e) => {
          commitError(commit, e);
          return { success: false, msg: e?.response?.data?.msg || e.message };
        })
        .finally(() => commit(setIsLoading, false));
    },

    repay({ commit }, { society_id, amount }) {
      commit(setIsLoading, true);

      return axios
        .post(`${SOCIETY_ACCOUNT_URL.repay}/${society_id}/repay`, { amount })
        .then((resp) => resp.data)
        .catch((e) => {
          commitError(commit, e);
          return { success: false, msg: e?.response?.data?.msg || e.message };
        })
        .finally(() => commit(setIsLoading, false));
    },
  },
};
