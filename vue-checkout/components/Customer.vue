<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" :panel="panel" />
		<v-expansion-panel-content>
			<div v-if="guestSignIn">
				<p>
					Checking out as a
					<strong>Guest</strong>? You'll be able to save your details to create an account with us
					later.
				</p>
			</div>
			<div v-else>
				<p>
					Don't have an account?
					<a :href="store_config.links.createAccountLink">Create an account</a> to continue.
				</p>
			</div>
			<v-form ref="form" @submit.prevent="signIn()">
				<div class="d-flex align-center">
					<v-text-field v-model="email" :error-messages="emailRules" label="E-mail" type="email" required></v-text-field>
					<v-btn
						:loading="loading"
						:disabled="!email.length"
						depressed
						v-if="guestSignIn"
						class="ml-4"
						type="submit"
						color="primary"
					>Continue as Guest</v-btn>
				</div>
				<div v-if="!guestSignIn">
					<v-text-field v-model="password" label="Password" :required="!guestSignIn"></v-text-field>
					<a class="d-block" :href="store_config.links.forgotPasswordLink">Forgot password?</a>
					<v-btn :loading="loading" :disabled="email.length" class="mr-4" type="submit">Sign In</v-btn>
					<v-btn @click="guestSignIn = true">Cancel</v-btn>
				</div>
				<v-checkbox v-model="newsletter" label="Sign up for newsletter"></v-checkbox>
			</v-form>
			<p v-if="guestSignIn">
				Already Have an account?
				<a @click="guestSignIn = false" text link>Sign In Now</a>
			</p>
		</v-expansion-panel-content>
		<v-divider></v-divider>
	</v-expansion-panel>
</template>

<script>
import PanelHeader from './PanelHeader.vue'

export default {
	name: 'CustomerPanel',
	props: ['service', 'checkout', 'store_config', 'panel'],
	components: {
		PanelHeader
	},
	data: () => ({
		panelInfo: {
			title: 'Customer',
			step: 0,
		},
		guestSignIn: true,
		email: '',
		emailRules: [v => !!v || 'E-mail is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
		password: '',
		newsletter: '',
		stepComplete: false,
		loading: false
	}),
	methods: {
		async signIn() {
			this.loading = true
			try {
				if (this.guestSignIn) {
					await this.service.continueAsGuest({
						email: this.email
					})
				} else {
					await this.service.signInCustomer({
						email: this.email,
						password: this.password
					})
				}
				this.stepComplete = true
				this.$emit('panelChange', 1)
			} catch (err) {
				console.log(err)
			}
			this.loading = false
		}
	}
}
</script>