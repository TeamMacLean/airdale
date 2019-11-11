export const state = () => ({
  sites: []
});

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  }
};

export const mutations = {
  setSites(state, sites) {
    state.sites = sites;
  }
};

export const actions = {
  async refreshSites({commit}) {
    return this.$axios.get('/sites')
      .then(({data}) => {
        commit('setSites', data.sites);
      })
      .catch((err) => {
        console.error(err);
      })
  }
};
