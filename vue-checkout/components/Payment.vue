<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="headline" hide-actions
>
      <div>
        <v-avatar color="black" size="30" style="position:absolute;left:-25px">
          <span class="white--text subtitle-1">4</span>
        </v-avatar>Payment
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div v-if="guestSignIn">
        <p>Checking out as a <strong>Guest</strong>? You'll be able to save your details to create an account with us
          later.</p>
      </div>
      <div v-else>
        <p>Don't have an account? <a :href="store_config.links.createAccountLink">Create an account</a> to continue.</p>
      </div>
      <form @submit.prevent="signIn()">
        <div class="d-flex align-center">
          <v-text-field v-model="email" :error-messages="emailErrors" label="E-mail" required @input="$v.email.$touch()"
            @blur="$v.email.$touch()"></v-text-field>

          <v-btn v-if="guestSignIn" class="ml-4" type="submit">Continue as Guest</v-btn>
        </div>
        <div v-if="!guestSignIn">
          <v-text-field v-model="password" label="Password" :required="!guestSignIn"></v-text-field>
          <a class="d-block" :href="store_config.links.forgotPasswordLink">Forgot password?</a>
          <v-btn class="mr-4" type="submit">Sign In</v-btn>
          <v-btn @click="guestSignIn = true">Cancel</v-btn>
        </div>
        <v-checkbox v-model="newsletter" label="Sign up for newsletter"></v-checkbox>
      </form>
      <p v-if="guestSignIn">Already Have an account? <a @click="guestSignIn = false" text link>Sign In Now</a></p>


    </v-expansion-panel-content>
    <v-divider></v-divider>
  </v-expansion-panel>
</template>

<script>
  import {
    email,
    required
  } from 'vuelidate/lib/validators'

  export default {
    name: 'PaymentPanel',
    props: ['service', 'checkout', 'store_config'],
    data: () => ({
      guestSignIn: true,
      email: '',
      password: '',
      newsletter: ''
    }),
    validations: {
      email: {
        required,
        email
      }
    },
    computed: {
      emailErrors() {
        const errors = []
        if (!this.$v.email.$dirty) {
          return errors
        }
        // !this.$v.email.email && errors.push('Must be valid e-mail') 
        // !this.$v.email.required && errors.push('E-mail is required')
        // return errors
      },
    },
    methods: {

    }
  }
</script>