<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register!</h2>

          <Notification :message="error" v-if="error"/>

          <form method="post" @submit.prevent="register">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="username"
                  minlength="6"
                  maxlength="20"
                  v-model="username"
                  required
                >
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  minlength="8"
                  maxlength="64"
                  v-model="email"
                  required
                >
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  minlength="8"
                  maxlength="64"
                  v-model="password"
                  required
                >
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Register</button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            Already got an account? <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
    import Notification from '~/components/Notification'

    export default {
        components: {
            Notification,
        },

        data() {
            return {
                username: '',
                email: '',
                password: '',
                error: null
            }
        },

        methods: {
            async register() {
                try {
                    await this.$axios.post('register', {
                        username: this.username,
                        email: this.email,
                        password: this.password
                    });

                    await this.$auth.loginWith('local', {
                        data: {
                            email: this.email,
                            password: this.password
                        },
                    });

                    this.$router.push('/')
                } catch (e) {
                    console.error(e);
                    this.error = e.message;
                }
            }
        }
    }
</script>
