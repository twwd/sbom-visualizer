<script lang="ts">
	import type { Component } from '$lib/cyclonedx/models';
	import { CodeSnippet, Tile } from 'carbon-components-svelte';

	const { component }: { component: Component } = $props();
</script>

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
					<td><CodeSnippet type="inline" code={component.purl} /></td>
				</tr>
			{/if}
			{#if component['bom-ref']}
				<tr>
					<th>BomRef</th>
					<td><CodeSnippet type="inline" code={component['bom-ref']} /></td>
				</tr>
			{/if}
		</tbody>
	</table>
</Tile>

<style lang="scss">
	th {
		font-weight: bold;
	}
</style>
