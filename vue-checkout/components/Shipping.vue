<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content>
			<div v-if="store_config.checkoutSettings.hasMultiShippingEnabled && !checkout.customer.isGuest">
				<a class="d-inline-block mb-8" @click="toggleMultipleAddresss">Ship to multiple addresses</a>
				<div v-if="multipleAddresses && checkout.customer.addresses.length">
					<v-slide-group
						:show-arrows="checkout.customer.addresses.length > 3"
						class="pa-6"
						center-active
					>
						<v-slide-item v-for="(address,index) of checkout.customer.addresses" :key="index">
							<v-card class="ma-4" width="300">
								<v-list-item three-line>
									<v-list-item-content>
										<v-list-item-title>{{address.firstName}} {{address.lastName}}</v-list-item-title>
										<v-list-item-title>{{address.company}} {{address.phone}}</v-list-item-title>
										<v-list-item-title>{{address.city}},{{address.stateOrProvince}},{{address.postalCode}}/ {{address.country}}</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-card>
						</v-slide-item>
					</v-slide-group>
				</div>
			</div>
			<v-form v-if="!multipleAddresses" ref="form" class="d-flex flex-wrap justify-space-between">
				<div v-for="(field, index) of fields" :key="index" :class="field.name">
					<v-text-field
						v-if="field.name !== 'countryCode' && field.name !== 'stateOrProvince' "
						v-model="address[field.name]"
						:label="field.label"
						:required="field.required"
						outlined
						:rules="field.required ? [v => !!v || `${field.label} is required`] : false"
						@input="validateForm"
					></v-text-field>
					<v-select
						v-if="field.name === 'countryCode' || field.name === 'stateOrProvince'"
						:items="field.name === 'countryCode' ? countries : states"
						item-text="name"
						item-value="code"
						outlined
						:label="field.label"
						:required="field.required"
						:rules="field.required ? [v => !!v || `${field.label} is required`] : false"
						:disabled="states.length === 0 && field.name === 'stateOrProvince'"
						v-model="address[field.name]"
						@change="field.name === 'countryCode' ? loadStates : false"
						@input="validateForm"
					></v-select>
				</div>
				<v-checkbox v-model="billingSame" label="My Billing address is the same as my Shipping address"></v-checkbox>
			</v-form>

			<div style="position:relative;min-height:150px">
				<v-overlay v-if="shippingOptions.length === 0" absolute opacity="0.4" color="#F5F5F5">
					<div
						v-if="!isLoading"
						class="text-center px-5 black--text"
						absolute
					>Please enter a shipping address in order to see shipping quotes</div>
					<v-progress-circular v-if="isLoading" indeterminate size="64" color="primary"></v-progress-circular>
				</v-overlay>
				<v-radio-group
					v-if="shippingOptions.length"
					v-model="selectedShipping"
					:loading="isLoading"
					@change="submitShipping"
					label="Shipping Method"
				>
					<v-list>
						<div v-for="(option, index) of shippingOptions" :key="option.id">
							<v-divider></v-divider>
							<v-list-item ripple="{ center: true }" dense>
								<v-list-item-content>
									<v-radio :label="option.description" :value="option.id"></v-radio>
								</v-list-item-content>
								<span v-if="option.cost === 0">Free</span>
								<span v-else>{{option.cost | currency}}</span>
							</v-list-item>
							<v-divider v-if="index === shippingOptions.length - 1"></v-divider>
						</div>
					</v-list>
				</v-radio-group>
			</div>

			<v-textarea
				v-if="store_config.checkoutSettings.enableOrderComments"
				v-model="customerMessage"
				name="comments"
				label="Order Comments"
				placeholder="Enter message here..."
				outlined
				class="mt-7"
				height="100"
			></v-textarea>
			<v-btn color="primary" :disabled="!selectedShipping" @click="submitShippingStep">Continue</v-btn>
		</v-expansion-panel-content>
		<v-divider></v-divider>
	</v-expansion-panel>
</template>

<script>
import PanelHeader from './PanelHeader.vue'
export default {
	name: 'ShippingPanel',
	props: ['service', 'checkout', 'store_config'],
	components: {
		PanelHeader
	},
	data: () => ({
		panelInfo: {
			title: 'Shipping',
			step: 1
		},
		billingSame: true,
		isLoading: false,
		fields: [],
		countries: [],
		states: [],
		customerMessage: '',
		address: {},
		shippingOptions: [],
		selectedShipping: null,
		multipleAddresses: false
	}),
	async created() {
		await this.getFormData()

		if (this.checkout.consignments.length) {
			const state = await this.service.loadShippingOptions()
			this.shippingOptions = state.data.getShippingOptions()
			this.address = this.checkout.consignments[0].shippingAddress
			this.selectedShipping = this.checkout.consignments[0].selectedShippingOption.id
		}
	},
	methods: {
		async getFormData() {
			this.fields = this.store_config.formFields.shippingAddressFields
			this.fields.forEach(i => (this.address[i.name] = ''))
			const state = await this.service.loadShippingCountries()
			this.countries = state.data.getShippingCountries()
			this.loadStates('US')
			this.address.countryCode = 'US'
			this.address.stateOrProvince = 'TX'
		},
		async loadShippingOptions() {
			this.isLoading = true
			try {
				await this.service.updateShippingAddress(this.address)
				await this.service.updateBillingAddress(this.address)

				const state = await this.service.loadShippingOptions()
				this.shippingOptions = state.data.getShippingOptions()
			} catch (err) {
				console.log(err)
			}
			this.isLoading = false
		},
		loadStates(e) {
			this.states = this.countries.filter(i => i.code === e)[0].subdivisions
		},
		validateForm() {
			if (this.$refs.form.validate()) {
				this.loadShippingOptions()
			}
		},
		async submitShipping() {
			try {
				const state = await this.service.selectShippingOption(this.selectedShipping)
			} catch (err) {
				console.log(err)
			}
		},
		async submitShippingStep() {
			await this.service.updateCheckout({ customerMessage: this.customerMessage })
			if (this.billingSame) {
				this.$store.dispatch('setPanel', 3)
			} else {
				this.$store.dispatch('setPanel', 2)
			}
		},
		async toggleMultipleAddresss() {
			this.multipleAddresses = !this.multipleAddresses
			if (this.multipleAddresses) {
			}
		}
	}
}
</script>

<style lang="scss">
.countryCode {
	width: 100%;
}
.firstName {
	width: 50%;
}
.lastName {
	width: 49%;
}
.address1 {
	width: 61%;
}
.company {
	width: 61%;
}
.stateOrProvince {
	width: 61%;
}
.phone {
	width: 100%;
}
</style>