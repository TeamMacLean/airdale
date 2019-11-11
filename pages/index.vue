<template>
  <div>
    <div class="section">
      <div class="container">

        <div v-if="isAuthenticated">
          <div>

            <h2 class="title is-4">News</h2>
            <p>no news :(</p>

          </div>
        </div>
        <div v-else>
          <p>
            * User - username, email, password
          </p>
          <p>
            * Company? - name, sites (used for displaying all public status pages in one place)
          </p>
          <p>
            * Site - name, url, api key, uniqueName
          </p>
          <p>
            * Ping - site, timeDate, responseTime
          </p>
          <p>
            * Event - site, type (success, info, warning, error), timeDate
          </p>
          <p>
            * Incident - site, type (degraded api, connectivity issues), timeDate
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        layout: 'admin',
        computed: {
            ...mapGetters(['isAuthenticated', 'loggedInUser'])
        },
    }
</script>
