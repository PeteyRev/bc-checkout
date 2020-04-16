<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content>
			<v-radio-group
				v-if="paymentOptions.length"
				v-model="paymentMethod"
				:loading="isLoading"
				label="Payment Method"
				required
			>
				<v-list elevation>
					<div v-for="(option, index) of paymentOptions" :key="option.id">
						<v-divider></v-divider>
						<v-list-item ripple="{ center: true }">
							<v-list-item-content>
								<v-radio :label="option.config.displayName" :value="option.id"></v-radio>
							</v-list-item-content>
							<div class="d-flex">
								<component
									v-for="(card, cardIndex) of option.supportedCards"
									class="card-icon"
									:key="cardIndex"
									:is="card"
								/>
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
			<v-btn color="primary" block large :disabled="!paymentMethod" @click="submitOrder">Place Order</v-btn>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
import CreditCard from './CreditCard.vue'
import PanelHeader from './PanelHeader.vue'
import VISA from '../icons/VISA.svg'
import MC from '../icons/MC.svg'
import AMEX from '../icons/AMEX.svg'
import DISCOVER from '../icons/DISCOVER.svg'
import JCB from '../icons/JCB.svg'
import DINERS from '../icons/DINERS.svg'

export default {
	name: 'PaymentPanel',
	props: ['service', 'checkout', 'store_config'],
	components: {
		CreditCard,
		PanelHeader,
		VISA,
		AMEX,
		DISCOVER,
		JCB,
		DINERS
	},
	data: () => ({
		isLoading: false,
		panelInfo: {
			title: 'Payment',
			step: 3
		},
		paymentMethod: null,
		paymentOptions: [],
		paymentData: {
			ccExpiry: { month: 10, year: 2022 },
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
	},
	methods: {
		async submitOrder() {
			await this.service.initializePayment({ methodId: this.paymentMethod })
			const payment = {
				methodId: this.paymentMethod,
				paymentData: this.paymentData
			}
			const state = await this.service.submitOrder({ payment })

			console.log(state.data.getOrder())

			window.location.assign('/order-confirmation')
		}
	}
}
</script>



<style lang="scss">
svg {
	width: 50px;
	height: 38px;
}
</style>