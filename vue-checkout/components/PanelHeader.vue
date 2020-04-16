<template>
	<v-expansion-panel-header class="headline" hide-actions>
		<div>
			<v-avatar color="black" size="30" style="position:absolute;left:-25px">
				<v-icon v-if="panel > panelInfo.step" color="white">mdi-check</v-icon>
				<span v-else class="white--text subtitle-1">{{panelInfo.step + 1}}</span>
			</v-avatar>
			{{panelInfo.title}}
		</div>
		<div v-if="panel > panelInfo.step">
			<div class="d-flex justify-end">
				<v-btn depressed small @click="$store.dispatch('setPanel', panelInfo.step)">Edit</v-btn>
			</div>
		</div>
	</v-expansion-panel-header>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'PanelHeader',
	props: ['panelInfo'],
	computed: {
		...mapState(['panel'])
	},
	methods: {

	}
}
</script>