<template>
	<div>
		<AddressForm
			v-if="checkout.customer.isGuest"
			:checkout="checkout"
			:service="service"
			v-on:getShippingOptions="getShippingOptions"
		/>
		<CustomerAddresses
			v-else
			:checkout="checkout"
			:service="service"
			:consignment_data="consignment_data"
		/>

		<div style="position:relative;min-height:150px">
			<v-overlay
				v-if="consignment_data.availableShippingOptions && consignment_data.availableShippingOptions.length ===  0"
				absolute
				opacity="0.4"
				color="#F5F5F5"
			>
				<div
					v-if="!isLoading"
					class="text-center px-5 black--text"
					absolute
				>Please enter a shipping address in order to see shipping quotes</div>
				<v-progress-circular v-if="isLoading" indeterminate size="64" color="primary"></v-progress-circular>
			</v-overlay>

			<v-list outlined rounded v-if="consignment_data.availableShippingOptions">
				<v-radio-group v-model="selectedShippingOption" @change="selectShippingOption">
					<div v-for="option of consignment_data.availableShippingOptions" :key="option.id">
						<v-list-item>
							<v-list-item-content>
								<v-radio :label="option.description" :value="option.id"></v-radio>
							</v-list-item-content>
							<span v-if="option.cost === 0">Free</span>
							<span v-else>{{option.cost | currency}}</span>
						</v-list-item>
					</div>
				</v-radio-group>
			</v-list>
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
		<Calendar v-if="checkout.consignments.length" v-on:dateSelected="dateSelected = $event" />
	</div>
</template>
<script>
import { mapState } from 'vuex'
import Calendar from './Calendar.vue'
import AddressForm from './AddressForm.vue'
import CustomerAddresses from './CustomerAddresses.vue'

export default {
	name: 'Consignment',
	props: ['service', 'checkout', 'store_config', 'consignment_data'],
	components: {
		Calendar,
		AddressForm,
		CustomerAddresses
	},
	data: () => ({
		isLoading: false,
		selectedShippingOption: '',
		customerMessage: '',
		dateSelected: '',
		street: ''
	}),
	computed: {
		...mapState(['cartItemTotal', 'multiShipOrder'])
	},
	methods: {
		async selectShippingOption() {
			try {
				if (this.multiShipOrder) {
					await this.service.selectConsignmentShippingOption(this.selectedShippingOption)
				} else {
					await this.service.selectShippingOption(this.selectedShippingOption)
				}
				this.street = this.consignment_data.shippingAddress.address1
			} catch (err) {
				console.log(err)
			}
		}
	}
}
</script>