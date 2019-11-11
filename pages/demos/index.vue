<template>
  <div>
    <div>
      <section class="masthead-container">
        <a href="#"><img src="~/static/tsl-full-heavy.png" class="logo" alt="logo"></a>
      </section>

      <section class="section">
        <div class="container">
          <div class="notification is-primary">
            <p class="title is-5">All Systems Operational</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="card">


          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="heading is-size-7 has-text-weight-bold">System Metrics</p>
          <div class="card">
            <client-only placeholder="Loading...">
              <Apexcharts width="100%" height="200px" type="line" :options="chartOptions" :series="series"></Apexcharts>
            </client-only>

          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="heading">Past Incidents</p>
        </div>
      </section>


    </div>

    <div>
      <div class="columns">
        <div class="column is-5">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        components: {
            Apexcharts: () => import('vue-apexcharts'),
        },
        data() {
            return {
                chartOptions: {
                    chart: {
                        id: 'vuechart-example'
                    },
                    xaxis: {
                        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                    }
                },
                series: [{
                    name: 'series-1',
                    data: [30, 40, 35, 50, 49, 60, 70, 91]
                }]
            }
        }
    }


</script>

<style>
  .masthead-container {
    width: 100% !important;
    max-width: 100% !important;
    height: 300px;
    border-bottom: 1px solid #d7d7d7;
    /*background: #738bd7 no-repeat top center;*/
    background: #6a89cc;
    text-align: center;
    margin-bottom: 60px !important;

    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center; /* not really needed with auto margin on img*/
  }

  .masthead-container .logo {
    display: block;
    width: 70%;
    height: auto; /* maintain aspect ratio*/
    margin: auto; /*optional centering of image*/
  }

  body{
    color:#737F8D;
  }
</style>
