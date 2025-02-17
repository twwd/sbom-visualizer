<script lang="ts">
	import type { Component } from '$lib/cyclonedx/models';
	import { Tile } from 'carbon-components-svelte';

	const { component }: { component: Component } = $props();
</script>

<style lang="scss">
	th {
		font-weight: bold;
	}
</style>

<Tile>
	<table class="bx--data-table">
		<tbody>
			<tr>
				<th>Name</th>
				<td>{component.name}</td>
			</tr>
			{#if component.group}
				<tr>
					<th>Group</th>
					<td>{component.group}</td>
				</tr>
			{/if}
			{#if component.version}
				<tr>
					<th>Version</th>
					<td>{component.version}</td>
				</tr>
			{/if}
			{#if component.purl}
				<tr>
					<th>PURL</th>
					<td>{component.purl}</td>
				</tr>
			{/if}
		</tbody>
	</table>
</Tile>
