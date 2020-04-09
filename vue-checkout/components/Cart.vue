<template>
	<v-card>
		<v-card-title class="pb-0 justify-space-between">
			Order Summary
			<a :href="store_config.links.cartLink" class="subtitle-1">Edit Cart</a>
		</v-card-title>
		<v-divider></v-divider>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-subtitle>{{cartItems}} Item</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>

		<v-list-item v-for="(item, index) of this.checkout.cart.lineItems.physicalItems" :key="index">
			<v-img max-width="100" contain :src="item.imageUrl"></v-img>
			<v-list-item-subtitle class="text-center ml-10">{{item.quantity}}x {{item.name}}</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{item.salePrice | currency}}</v-list-item-subtitle>
		</v-list-item>

		<v-divider></v-divider>
		<v-list-item dense>
			<v-list-item-subtitle>Subtotal</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{checkout.subtotal | currency}}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item dense>
			<v-list-item-subtitle>Shipping</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{checkout.shippingCostTotal | currency}}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item dense>
			<v-list-item-subtitle>Tax</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{checkout.taxTotal | currency}}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item dense>
			<v-list-item-content>
				<v-list-item-subtitle>
					<a href="#" @click.prevent="collapseCoupon = !collapseCoupon">Coupon/Gift Certificate</a>
				</v-list-item-subtitle>
				<div v-if="collapseCoupon" class="d-flex">
					<v-btn>Apply</v-btn>
					<v-text-field outlined></v-text-field>
				</div>
			</v-list-item-content>
		</v-list-item>
		<v-divider></v-divider>
		<v-list-item class="pb-4">
			<v-list-item-subtitle>Total ({{code}})</v-list-item-subtitle>
			<v-list-item-subtitle
				class="text-right headline font-weight-bold"
			>{{checkout.grandTotal | currency}}</v-list-item-subtitle>
		</v-list-item>
	</v-card>
</template>

<script>
export default {
	name: 'Cart',
	props: ['service', 'checkout', 'store_config'],
	data: () => ({
		cartItems: 0,
		symbol: '$',
		code: 'USD',
		collapseCoupon: false
	}),
	created() {
		this.symbol = this.checkout.cart.currency.symbol
		this.code = this.checkout.cart.currency.code
		Object.keys(this.checkout.cart.lineItems).forEach(i => {
			this.cartItems += this.checkout.cart.lineItems[i].length
		})
	},
	methods: {}
}
</script>