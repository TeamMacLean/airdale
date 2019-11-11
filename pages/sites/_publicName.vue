<template>
  <div>
    <div class="section">
      <div class="container">
        <p class="title">{{site.name}}</p>
        <div class="card graph-card">
          <div class="card-content">
            <p class="custom-here-1 is-size-5 is-pulled-left">Response Time</p>
            <p class="custom-here-1 is-size-5 is-pulled-right">{{averageResponseTime}} ms</p>
            <div class="is-clearfix"></div>
            <GraphResponseTime :site="site"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import GraphResponseTime from '../../components/GraphResponseTime'

    export default {
        middleware: 'auth',
        components: {
            GraphResponseTime
        },
        asyncData({route, $axios, error, store}) {

            if (!route.params.publicName) {
                error({statusCode: 404, message: 'Site not found'})
            }

            return $axios.get('/site', {params: {publicName: route.params.publicName}})
                .then(res => {
                        if (res.status === 200 && res.data.site) {
                            return {
                                site: res.data.site,
                            }
                        } else {
                            error({statusCode: 501, message: 'Site not found'})
                        }
                    }
                )
                .catch(err => {
                    console.error(err);
                    error({statusCode: 501, message: 'Site not found'})
                });


        }
    }
</script>

<style>
  .graph-card {
    border-radius: 4px !important;
    border: 1px solid #E0E0E0;
    box-shadow: none;
  }

  .custom-here-1 {
    font-weight: bold;
    color: #737F8D;
  }


</style>
