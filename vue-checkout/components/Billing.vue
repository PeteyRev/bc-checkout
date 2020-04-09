<template>
	<v-expansion-panel>
		<v-expansion-panel-header class="headline" hide-actions>
			<div>
				<v-avatar color="black" size="30" style="position:absolute;left:-25px">
					<span class="white--text subtitle-1">3</span>
				</v-avatar>Billing
			</div>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<form v-if="store_config.formFields" @submit.prevent="submitBilling()">
				<div v-for="field of store_config.formFields.billingAddressFields" :key="field.id">
					<v-text-field
						v-if="field.name !== 'countryCode' && field.name !== 'stateOrProvince' "
						v-model="email"
						:label="field.label"
						:required="field.required"
					></v-text-field>
					<v-select
						v-if="field.name === 'countryCode'"
						:countries="countries"
						:label="field.label"
						:required="field.required"
					></v-select>
					<v-select
						v-if="field.name === 'stateOrProvince'"
						:states="states"
						:label="field.label"
						:required="field.required"
					></v-select>
				</div>
				<v-btn class="mr-4" type="submit">Continue</v-btn>
			</form>
		</v-expansion-panel-content>
		<v-divider></v-divider>
	</v-expansion-panel>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'

export default {
	name: 'BillingPanel',
	props: ['service', 'checkout', 'store_config'],
	data: () => ({
		fields: [],
		countries: []
	}),
	methods: {
		async submitBilling() {
			try {
				await this.service.continueAsGuest({
					email: this.email
				})
				this.$emit('panelChange', 0)
			} catch (err) {
				console.log(err)
			}
		}
	}
}
</script>