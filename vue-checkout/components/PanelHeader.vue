<template>
	<v-expansion-panel-header class="headline" hide-actions>
		<div>
			<v-avatar color="black" size="30" style="position:absolute;left:-25px">
				<v-icon v-if="stepComplete" color="white">mdi-check</v-icon>
				<span v-else class="white--text subtitle-1">1</span>
			</v-avatar>
			{{panelInfo.title}}
		</div>
		<div v-if="panel > panelInfo.step">
			<div>
				<v-btn depressed small @click="$emit('panelChange', 0)">Edit</v-btn>
			</div>
		</div>
	</v-expansion-panel-header>
</template>

<script>
export default {
	name: 'PanelHeader',
	props: ['panelInfo', 'panel']
}
</script>