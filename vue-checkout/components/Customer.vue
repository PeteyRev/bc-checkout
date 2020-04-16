<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content>
			<v-form ref="form" @submit.prevent="signIn()">
				<div v-if="store_config.checkoutSettings.guestCheckoutEnabled && !showCustomerSignIn">
					<p>
						Checking out as a
						<strong>Guest</strong>? You'll be able to save your details to create an account with us
						later.
					</p>
					<div class="d-flex align-center">
						<v-text-field v-model="email" label="E-mail" type="email" required></v-text-field>
						<v-btn
							:loading="loading"
							:disabled="!email.length"
							depressed
							class="ml-4"
							type="submit"
							color="primary"
						>Continue as Guest</v-btn>
					</div>
					<v-checkbox
						v-if="store_config.shopperConfig.showNewsletterSignup"
						v-model="newsletter"
						label="Sign up for newsletter"
					></v-checkbox>
					<p>
						Already Have an account?
						<a @click="showCustomerSignIn = true" text link>Sign In Now</a>
					</p>
				</div>
				<div v-if="showCustomerSignIn">
					<v-text-field v-model="email" label="E-mail" type="email" required></v-text-field>
					<v-text-field
						v-model="password"
						label="Password"
						type="password"
						:required="showCustomerSignIn"
					></v-text-field>
					<a class="d-block mb-5" :href="store_config.links.forgotPasswordLink">Forgot password?</a>
					<v-btn :loading="loading" :disabled="!email.length" class="mr-4" type="submit">Sign In</v-btn>
					<v-btn
						v-if="store_config.checkoutSettings.guestCheckoutEnabled"
						@click="showCustomerSignIn = false"
					>Cancel</v-btn>
				</div>
			</v-form>
		</v-expansion-panel-content>
		<v-divider></v-divider>
	</v-expansion-panel>
</template>

<script>
import PanelHeader from './PanelHeader.vue'

export default {
	name: 'CustomerPanel',
	props: ['service', 'checkout', 'store_config'],
	components: {
		PanelHeader
	},
	data: () => ({
		panelInfo: {
			title: 'Customer',
			step: 0
		},
		showCustomerSignIn: false,
		email: '',
		emailRules: [v => !!v || 'E-mail is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
		password: '',
		newsletter: '',
		loading: false
	}),
	created() {
		this.newsletter = this.store_config.shopperConfig.defaultNewsletterSignup
		if (!this.store_config.checkoutSettings.guestCheckoutEnabled) {
			this.showCustomerSignIn = true
		}
	},
	methods: {
		async signIn() {
			this.loading = true
			try {
				if (this.showCustomerSignIn) {
					await this.service.signInCustomer({
						email: this.email,
						password: this.password
					})
				} else {
					await this.service.continueAsGuest({
						email: this.email,
						acceptsMarketingNewsletter: this.newsletter,
						acceptsAbandonedCartEmails: true
					})
				}
				this.$store.dispatch('setPanel', 1)
			} catch (err) {
				console.log(err)
			}
			this.loading = false
		}
	}
}
</script>