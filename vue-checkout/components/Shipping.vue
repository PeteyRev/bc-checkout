<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="headline" hide-actions
>
      <div>
        <v-avatar color="black" size="30" style="position:absolute;left:-25px">
          <span class="white--text subtitle-1">2</span>
        </v-avatar>Shipping
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-form ref="form" v-model="valid" @blur="validateForm">
        <div v-for="(field, index) of fields" :key="index">
          <v-text-field v-if="field.name !== 'countryCode' && field.name !== 'stateOrProvince' "
            v-model="address[field.name]" :label="field.label" :required="field.required">
          </v-text-field>
          <v-select v-if="field.name === 'countryCode'" :items="countries" item-text="name" item-value="code"
            :label="field.label" :required="field.required" v-model="address[field.name]"></v-select>
          <v-select v-if="field.name === 'stateOrProvince'" return-object :items="states" item-text="name"
            :label="field.label" :required="field.required" v-model="address[field.name]"></v-select>
        </div>
        <v-checkbox v-model="billingSame" label="My Billing address is the same as my Shipping address"></v-checkbox>
      </v-form>
      <v-sheet>
        <v-radio-group v-model="selectedShipping">
          <v-radio v-for="option of shippingOptions" :key="option.id" :label="option.description" :value="option.id">
          </v-radio>
        </v-radio-group>
      </v-sheet>

      <v-textarea v-if="store_config.checkoutSettings.enableOrderComments" v-model="address.comments" name="comments"
        label="Order Comments" hint="Enter text here..." outlined></v-textarea>
    </v-expansion-panel-content>
    <v-divider></v-divider>
  </v-expansion-panel>
</template>

<script>
  import {
    email,
    required
  } from 'vuelidate/lib/validators'

  export default {
    name: 'ShippingPanel',
    props: ['service', 'checkout', 'store_config'],
    data: () => ({
      billingSame: true,
      valid: true,
      fields: [],
      countries: [],
      address: {
        comments: ''
      },
      shippingOptions: [],
      selectedShipping: ''
    }),
    created() {
      this.getFormData()
    },
    methods: {
      async getFormData() {
        this.fields = this.store_config.formFields.shippingAddressFields
        this.fields.forEach(i => this.address[i.name] = '')
        const state = await this.service.loadShippingCountries();
        this.countries = state.data.getShippingCountries()
      },
      async loadShippingOptions() {
        try {
          await this.service.updateShippingAddress(this.address);
          const state = await this.service.loadShippingOptions();
          this.shippingOptions = state.data.getShippingOptions()
        } catch (err) {
          console.log(err)
        }

      },
      validateForm() {
        set
        console.log(this.$refs.form.validate())
        this.$refs.form.validate()
      },
      async submitShipping() {

      }
    }
  }
</script>