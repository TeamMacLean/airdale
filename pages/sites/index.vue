<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-4">Sites</h2>
      <div class="buttons">
        <nuxt-link to="/sites/new">
          <b-button icon-left="plus">
            Add
          </b-button>
        </nuxt-link>
      </div>
      <div class="columns" v-for="i in Math.ceil(sites.length / 2)">
        <div class="column is-6" v-for="site in sites.slice((i - 1) * 2, i * 2)">
          <SiteCard :site="site"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import SiteCard from "../../components/SiteCard";
    export default {
        components: {SiteCard},
        middleware: 'auth',

        mounted() {
            this.$store.dispatch('refreshSites')
        },
        computed: {
            sites() {
                return JSON.parse(JSON.stringify(this.$store.state.sites))
            }
        }
    }
</script>
