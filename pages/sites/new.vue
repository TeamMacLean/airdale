<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-4">New Site</h2>
      <form method="post" @submit.prevent="register">
        <div class="columns">
          <div class="column">
            <b-field label="Name">
              <b-input type="string" placeholder="Example" v-model="name" minLength="4" maxLength="32"
                       required></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Public name" :message="futureURL">
              <b-input type="test" placeholder="Example" v-model="publicName" minLength="4" maxLength="32"
                       required></b-input>
            </b-field>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <b-field label="URL">
              <b-input type="url" placeholder="http://example.org" v-model="url" minLength="4" maxLength="256"
                       required></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Description (optional)">
              <b-input type="string" placeholder="My Website" v-model="description"></b-input>
            </b-field>
          </div>
        </div>

        <Notification :message="error" v-if="error"/>
        <div class="buttons is-right">
          <button class="button" type="submit">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
    import sanitize from 'sanitize-filename'
    import urlSlug from 'url-slug'
    import Notification from '~/components/Notification'

    export default {
        middleware: 'auth',
        components: {
            Notification,
        },
        data() {
            return {
                name: '',
                publicName: '',
                url: '',
                description: '',
                error: null
            }
        },
        computed: {
            sanitizedName() {
                return urlSlug(sanitize(this.publicName))
            },
            futureURL() {
                return this.sanitizedName.length ? 'Your unique status page url will be ' + this.sanitizedName + '.airdale.tsl.ac.uk' : ' '
            }
        },
        methods: {
            async register() {
                try {
                    await this.$axios.post('sites/new', {
                        name: this.name,
                        url: this.url,
                        description: this.description,
                        publicName:this.publicName
                    });

                    this.$router.push('/sites')
                } catch (e) {
                    this.error = e.message;
                }
            }
        }
    }
</script>
