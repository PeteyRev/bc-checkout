<template>
	<v-card flat outlined class="pa-5 my-5" color="grey lighten-4">
		<v-form ref="form">
			<v-row>
				<v-col cols="9">
					<v-text-field
						v-model="ccNumber"
						append-icon="mdi-lock"
						label="Credit Card Number"
						@input="validateForm"
						type="number"
						required
					></v-text-field>
				</v-col>
				<v-col cols="3">
					<v-text-field
						v-model="ccExp"
						label="Expiration"
						placeholder="MM/YY"
						@input="validateForm"
						required
					></v-text-field>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="9">
					<v-text-field v-model="ccName" label="Name on Card" @input="validateForm" required></v-text-field>
				</v-col>
				<v-col cols="3">
					<v-text-field v-model="cvv" type="number" label="CVV" @input="validateForm" required></v-text-field>
				</v-col>
			</v-row>
		</v-form>
	</v-card>
</template>

<script>
export default {
	name: 'CreditCard',
	data: () => ({
		ccNumber: '4111111111111111',
		ccName: 'oBundle Dev',
		ccExp: '10/20',
		cvv: 123
	}),
	methods: {
		validateForm() {
			console.log(this.$refs.form.validate())
			if (this.$refs.form.validate()) {
				this.loadShippingOptions()
			}
		}
	}
}
</script>