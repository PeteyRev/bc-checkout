<template>
	<v-app>
		<v-container>
			<v-row justify="center" v-if="store_config.checkoutSettings">
				<v-col cols="12">
					<v-row>
						<v-col cols="7" xl="8">
							<v-row no-gutters>
								<v-col cols="12" lg="10">
									<v-expansion-panels flat tile accordion readonly v-model="panel">
										<Customer
											:service="service"
											:checkout="checkout"
											:store_config="store_config"
											:panel="panel"
											@panelChange="changePanel"
										/>
										<Shipping
											:service="service"
											:checkout="checkout"
											:store_config="store_config"
											:panel="panel"
											@panelChange="changePanel"
										/>
										<Billing
											:service="service"
											:checkout="checkout"
											:store_config="store_config"
											:panel="panel"
											@panelChange="changePanel"
										/>
										<Payment
											:service="service"
											:checkout="checkout"
											:store_config="store_config"
											:panel="panel"
											@panelChange="changePanel"
										/>
									</v-expansion-panels>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="5" xl="4">
							<Cart :service="service" :checkout="checkout" :store_config="store_config" />
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script>
import { createCheckoutService } from '@bigcommerce/checkout-sdk'
import axios from 'axios'
import Customer from './components/Customer.vue'
import Shipping from './components/Shipping.vue'
import Billing from './components/Billing.vue'
import Payment from './components/Payment.vue'
import Cart from './components/Cart.vue'

export default {
	data: () => ({
		store_config: {},
		checkout: {},
		service: {},
		panel: 0,
		cartItems: 0
	}),
	components: {
		Customer,
		Shipping,
		Billing,
		Payment,
		Cart
	},
	mounted() {
		this.getCheckout()
	},
	methods: {
		async getCheckout() {
			try {
				const checkout = await axios.get('/api/storefront/carts')
				this.service = createCheckoutService()
				const state = await this.service.loadCheckout(checkout.data[0].id)
				this.checkout = await state.data.getCheckout()
				this.store_config = await state.data.getConfig()

				Object.keys(this.checkout.cart.lineItems).forEach(i => {
					this.cartItems += this.checkout.cart.lineItems[i].length
				})

				const consignments = this.checkout.consignments
				console.log(consignments)

				// if (consignments.length && !consignments[0].shippingAddress) {
				// 	this.changePanel(1)
				// }
				// if (consignments.length && consignmentss[0].shippingAddress) {
				// 	this.changePanel(3)
				// }
				// if (!consignments.length) {
				// 	this.changePanel(0)
				// }

				this.service.subscribe(state => {
					this.checkout = state.data.getCheckout()
				})
			} catch (err) {
				console.log(err)
			}
		},
		changePanel(panel) {
			this.panel = panel
		}
	}
}
</script>

<style lang="scss">
@import '../node_modules/vuetify/dist/vuetify.min.css';
.v-application--wrap {
	margin: 0 auto;
	max-width: 92.30769rem;
	width: 100%;
	min-height: 15.38462rem;
	padding: 0 1.5rem 7.5rem;
}
</style>