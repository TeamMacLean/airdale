<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="faviconURL" alt="site icon">
          </figure>
        </div>
        <div class="media-content">
          <nuxt-link :to="{ name: 'sites-publicName', params: { publicName: site.publicName }}">
            <p class="title is-4">
              {{site.name}}
            </p>
          </nuxt-link>
          <p class="subtitle is-6">{{site.url}}</p>
        </div>
      </div>
      <div class="content">
        {{site.description}}
        <GraphResponseTime :site="site"/>
      </div>
    </div>
  </div>
</template>

<script>
    import GraphResponseTime from '../components/GraphResponseTime'
    // import getFavicons from 'get-website-favicon';

    export default {
        components: {
            GraphResponseTime
        },
        props: ['site'],
        computed:{
            faviconURL(){
                return this.site.url + '/favicon.ico'
            }
        }
        // data() {
        //     return {faviconURL: ''}
        // },
        // mounted() {
        //     if (this.site && this.site.url) {
        //         getFavicons(this.site.url)
        //             .then(data => {
        //                 if (data.icons) {
        //                     this.faviconURL = data.icons[0].src
        //                 }
        //             })
        //             .catch(err => {
        //                 console.error(err);
        //             })
        //     }
        // }


    }
</script>
