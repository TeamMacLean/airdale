<template>
  <b-navbar>
    <template slot="brand">
      <nuxt-link to="/" class="navbar-item">
        <img
          src="~/static/logo.png"
          alt="Airdale"
        >
      </nuxt-link>
    </template>
    <template slot="start">
      <nuxt-link to="/" class="navbar-item">
        Home
      </nuxt-link>
      <nuxt-link to="/sites" class="navbar-item">
        Sites
      </nuxt-link>
      <!--      <b-navbar-dropdown label="Info">-->
      <!--        <b-navbar-item href="#">-->
      <!--          About-->
      <!--        </b-navbar-item>-->
      <!--        <b-navbar-item href="#">-->
      <!--          Contact-->
      <!--        </b-navbar-item>-->
      <!--      </b-navbar-dropdown>-->
    </template>

    <template slot="end">
      <div class="navbar-item has-dropdown is-hoverable" v-if="isAuthenticated">
        <a class="navbar-link">{{ loggedInUser.username }}
        </a>
        <div class="navbar-dropdown">
          <nuxt-link to="/profile" class="navbar-item">
            My Profile
          </nuxt-link>
          <hr class="navbar-divider">
          <a class="navbar-item" @click="logout">Logout</a>
        </div>
      </div>
      <div class="navbar-item" v-else>
        <div class="buttons">
          <nuxt-link to="/register" class="button is-primary">
            Register
          </nuxt-link>
          <nuxt-link to="/login" class="button is-light">
            Log In
          </nuxt-link>
        </div>
      </div>

    </template>

  </b-navbar>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters(['isAuthenticated', 'loggedInUser'])
        },
        methods: {
            async logout() {
                await this.$auth.logout();
            },
        },
    }
</script>
