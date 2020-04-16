<template>
	<v-card flat outlined class="pa-5 my-5" color="grey lighten-4">
		<v-form ref="form">
			<v-row>
				<v-col cols="9">
					<v-text-field
						v-model="ccNumber"
						append-icon="mdi-lock"
						label="Credit Card Number"
						@input="getCardType"
						:rules="[rules.required, rules.cardNumber]"
						required
					></v-text-field>
				</v-col>
				<v-col cols="3">
					<v-text-field
						label="Expiration"
						placeholder="MM/YY"
						v-model="expiry"
						@input="formatExpiry"
						:rules="[rules.required, rules.expDate]"
						required
					></v-text-field>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="9">
					<v-text-field
						v-model="ccName"
						:rules="[rules.required]"
						label="Name on Card"
						@input="validateForm"
						required
					></v-text-field>
				</v-col>
				<v-col cols="3">
					<v-text-field
						v-model="ccCvv"
						:rules="[rules.required, rules.cvvNumber]"
						type="number"
						label="CVV"
						required
					></v-text-field>
				</v-col>
			</v-row>
		</v-form>
	</v-card>
</template>

<script>
import validCard from 'card-validator'


export default {
	name: 'CreditCard',
	data: () => ({
		expiry: null,
		ccExpiry: {},
		ccName: '',
		ccNumber: '',
		ccType: '',
		ccCvv: '',
		rules: {
			required: value => !!value || 'Required.',
			cardNumber: value => !!validCard.number(value).card || 'Card number not recognized',
			expDate: value => !!validCard.expirationDate(value).year || 'Expiration date invalid',
			cvvNumber: value => !!validCard.cvv(value).isValid || 'CVV is invalid'
		}
	}),

	methods: {
		getCardType() {
			const cardNumber = validCard.number(this.ccNumber)
			if (cardNumber.card) {
				this.ccType = cardNumber.card.type
			}
		},
		formatExpiry() {
			const dates = validCard.expirationDate(this.expiry)
			if (dates.isValid) {
				this.ccExpiry = {
					month: dates.month,
					year: dates.year
				}
			}
		},
		validateForm() {
			console.log(this.$refs.form.validate())
			if (this.$refs.form.validate()) {
				console.log('good')
			}
		}
	}
}
</script>