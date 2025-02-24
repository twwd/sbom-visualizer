<script lang="ts">
	import {
		Button,
		DataTable,
		Pagination,
		Toolbar,
		ToolbarContent,
		ToolbarSearch
	} from 'carbon-components-svelte';
	import type { DataTableRow } from 'carbon-components-svelte/src/DataTable/DataTable.svelte';
	import type { Component } from '$lib/cyclonedx/models';
	import { DecisionTree, Document, TreeView } from 'carbon-icons-svelte';

	let {
		components,
		searchComponentInTreeView,
		searchComponentInTreeGraph,
		showComponentDetails,
		searchValue = ''
	}: {
		components: Component[];
		searchComponentInTreeView: (id: string) => void;
		searchComponentInTreeGraph: (id: string) => void;
		showComponentDetails: (component: Component) => void;
		searchValue: string;
	} = $props();

	let rows: DataTableRow[] = $derived.by(() => {
		return components.map((component) => {
			return {
				id: component['bom-ref'],
				name: component.name,
				group: component.group,
				version: component.version,
				purl: component.purl,
				bomRef: component['bom-ref']
			};
		});
	});

	let pageSize = $state(25);
	let page = $state(1);

	function showComponentDetailsForRow(row: DataTableRow) {
		const componentRef: string = row.id;
		const component = components.find(
			(component: Component) => component['bom-ref'] === componentRef
		);
		if (component) {
			showComponentDetails(component);
		}
	}
</script>

<h2>Components</h2>
<p>The BOM has {components.length} components.</p>
<DataTable
	sortable
	headers={[
		{ key: 'name', value: 'Name' },
		{ key: 'group', value: 'Group' },
		{ key: 'version', value: 'Version' },
		{ key: 'purl', value: 'PURL' },
		{ key: 'actions', empty: true }
	]}
	{rows}
	{pageSize}
	{page}
>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch persistent shouldFilterRows value={searchValue} />
		</ToolbarContent>
	</Toolbar>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === 'actions'}
			<div class="actions">
				<Button
					size="small"
					icon={TreeView}
					iconDescription="Show component in dependency tree view"
					kind="ghost"
					on:click={() => searchComponentInTreeView(row.id)}
				/>
				<Button
					size="small"
					icon={DecisionTree}
					iconDescription="Show component in dependency tree graph"
					kind="ghost"
					on:click={() => searchComponentInTreeGraph(row.id)}
				/>
				<Button
					size="small"
					icon={Document}
					iconDescription="Show details"
					kind="ghost"
					on:click={() => showComponentDetailsForRow(row)}
				/>
			</div>
		{:else}{cell.value}{/if}
	</svelte:fragment>
</DataTable>

<Pagination bind:pageSize bind:page totalItems={rows.length} pageSizes={[25, 50, 100]} />

<style lang="scss">
	@use '@carbon/layout';

	h2 {
		margin-bottom: layout.$spacing-05;
	}

	p {
		margin-bottom: layout.$spacing-04;
	}

	.actions {
		white-space: nowrap;
	}
</style>
