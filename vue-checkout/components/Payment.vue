<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content>
			<v-radio-group
				v-if="paymentOptions.length"
				v-model="paymentMethod"
				:loading="isLoading"
				label="Payment Method"
			>
				<v-list>
					<div v-for="(option, index) of paymentOptions" :key="option.id">
						<v-divider></v-divider>
						<v-list-item ripple="{ center: true }" dense>
							<v-list-item-content>
								<v-radio :label="option.config.displayName" :value="option.id"></v-radio>
							</v-list-item-content>
							<div class="d-flex">
								<div v-for="(card, cardIndex) of option.supportedCards" :key="cardIndex">{{card}}</div>
							</div>
						</v-list-item>
						<CreditCard
							v-if="option.method === 'credit-card' || option.method === 'zzzblackhole'"
							v-show="paymentMethod === option.id"
						/>
						<v-divider v-if="index === paymentOptions.length - 1"></v-divider>
					</div>
				</v-list>
			</v-radio-group>
			<v-btn color="primary" @click="submitOrder">Place Order</v-btn>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
import CreditCard from './CreditCard.vue'
import PanelHeader from './PanelHeader.vue'

export default {
	name: 'PaymentPanel',
	props: ['service', 'checkout', 'store_config', 'panel'],
	components: {
		CreditCard,
		PanelHeader
	},
	data: () => ({
		isLoading: false,
		panelInfo: {
			title: 'Payment',
			step: 3,
			currentStep: 3
		},
		paymentMethod: '',
		paymentOptions: [],
		paymentData: {
			ccExpiry: { month: 10, year: 20 },
			ccName: 'BigCommerce',
			ccNumber: '4111111111111111',
			ccType: 'visa',
			ccCvv: 123
		}
	}),
	async mounted() {
		this.isLoading = true
		const state = await this.service.loadPaymentMethods()
		this.paymentOptions = state.data.getPaymentMethods()
		this.panelInfo.currentStep = this.panel
	},
	methods: {
		async submitOrder() {
			await this.service.initializePayment({ methodId: this.paymentMethod })
			const payment = {
				methodId: 'braintree',
				paymentData: {
					ccExpiry: { month: 10, year: 20 },
					ccName: 'BigCommerce',
					ccNumber: '4111111111111111',
					ccType: 'visa',
					ccCvv: 123
				}
			}

			const state = await this.service.submitOrder({ payment })

			console.log(state.getOrder())

			// window.location.assign('/order-confirmation')
		}
	}
}
</script>