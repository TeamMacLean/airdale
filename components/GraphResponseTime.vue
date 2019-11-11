<template>
  <client-only placeholder="Loading..." v-if="series && series.length && series[0].data && series[0].data.length">
    <Apexcharts width="100%" height="150px" type="line" :options="chartOptions" :series="series"></Apexcharts>
  </client-only>
</template>

<script>
    export default {
        props: ['site'],
        components: {
            Apexcharts: () => import('vue-apexcharts'),
        },
        data() {
            const primaryColour = '#6082CE';
            const graphLabelColours = '#8CA0AB';
            return {
                series: [],
                data: [],
                chartOptions: {
                    chart: {
                        id: 'vuechart-example',
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false,
                        },
                    },
                    grid: {
                        row: {
                            opacity: 0.2
                        },
                        column: {
                            opacity: 0.2
                        }
                    },
                    legend: {
                        labels: {
                            colors: graphLabelColours
                        }
                    },
                    colors: [primaryColour],
                    stroke: {
                        width: 2,
                        curve: 'smooth',
                        // lineCap: 'butt',
                    },

                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        type: 'datetime',

                        labels: {
                            rotate: 0,
                            format: 'hh:mm',
                            style: {
                                colors: graphLabelColours
                            }
                        },

                        axisBorder: {
                            // height:0,
                            show: false,
                            color: graphLabelColours
                        },
                        axisTicks: {
                            color: graphLabelColours,
                        },

                        tooltip: {
                            enabled: false
                        }
                    },
                    yaxis: {
                        min: 0,
                        tickAmount: 3,
                        labels: {
                            style: {
                                color: graphLabelColours
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function (value) {
                                return value + ' ms'
                            }
                        },
                        x: {
                            format: 'dddd MMM dd hh:mm',
                        }
                    },
                },
            }
        },
        mounted() {
            this.$axios.get('/site', {params: {publicName: this.site.publicName}})
                .then(res => {
                        if (res.status === 200 && res.data.site) {

                            const data = [];
                            res.data.responses.map(r => {
                                data.push({x: r.date, y: r.duration})
                            });
                            this.series = [{
                                name: 'response time',
                                data: data
                            }];
                            console.log(this.series);
                        } else {
                            console.error('FAIL!')
                        }
                    }
                )
                .catch(err => {
                    console.error(err);
                    // error({statusCode: 501, message: 'Site not found'})
                });
        }
    }
</script>
