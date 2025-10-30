// store/modules/sms_logs.js
import { setIsLoading, setError } from "../constants";
import axios, { SMS_LOG_URL } from "../api";
import { commitError, stopLoadingAndResolve } from "./app";

export default {
  namespaced: true,

  state: {
    isLoading: false,
    error: null,
    logs: [],
    pagination: {},
    filters: {
      type: "",
      status: "",
      date_from: "",
      date_to: "",
    },
    filterOptions: {
      types: [],
      statuses: ["sent", "failed"],
    },
  },

  getters: {
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    logs: (state) => state.logs,
    pagination: (state) => state.pagination,
    filters: (state) => state.filters,
    filterOptions: (state) => state.filterOptions,
    hasFilters: (state) =>
      state.filters.type ||
      state.filters.status ||
      state.filters.date_from ||
      state.filters.date_to,
  },

  mutations: {
    [setIsLoading]: (state, isLoading) => (state.isLoading = isLoading),
    [setError]: (state, error) => (state.error = error),

    SET_LOGS: (state, logs) => {
      state.logs = logs;
    },
    SET_PAGINATION: (state, pagination) => {
      state.pagination = pagination;
    },
    SET_FILTER_OPTIONS: (state, options) => {
      state.filterOptions = { ...state.filterOptions, ...options };
    },
    SET_FILTERS: (state, filters) => {
      state.filters = { ...state.filters, ...filters };
    },
    CLEAR_FILTERS: (state) => {
      state.filters = { type: "", status: "", date_from: "", date_to: "" };
    },
  },

  actions: {
    // ✅ Fetch SMS logs
    async getSmsLogs({ commit }, { page = 1, filters = {} } = {}) {
      commit(setIsLoading, true);
      commit(setError, null);

      try {
        const params = { page, ...filters };
        const resp = await axios.get(SMS_LOG_URL.index, { params });
        const { success, data } = resp.data;

        if (success) {
          commit("SET_LOGS", data.data);
          commit("SET_PAGINATION", data.pagination);
          commit("SET_FILTER_OPTIONS", data.filters);
          return { success: true };
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (e) {
        console.error("💣 Caught error in getSmsLogs:", e);
        commitError(commit, e);
        return { success: false };
      } finally {
        stopLoadingAndResolve(commit);
      }
    },

    // ✅ Update filters
    updateFilters({ commit, dispatch }, filters) {
      commit("SET_FILTERS", filters);
      dispatch("getSmsLogs", { page: 1, filters });
    },

    // ✅ Clear filters
    clearFilters({ commit, dispatch }) {
      commit("CLEAR_FILTERS");
      dispatch("getSmsLogs", { page: 1 });
    },

    // ✅ Go to a specific page
    goToPage({ dispatch, state }, page) {
      dispatch("getSmsLogs", { page, filters: state.filters });
    },
  },
};
