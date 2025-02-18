<script lang="ts">
	import type { Bom } from '$lib/cyclonedx/models';
	import ComponentsTable from '$lib/components/ComponentsTable.svelte';
	import ComponentsTreeView from '$lib/components/ComponentsTreeView.svelte';
	import { Button, Tab, TabContent, Tabs, Tile } from 'carbon-components-svelte';
	import ComponentsTree from '$lib/components/ComponentsTree.svelte';
	import ComponentModal from '$lib/components/ComponentModal.svelte';
	import { Document } from 'carbon-icons-svelte';

	let { bom = null }: { bom: Bom | null } = $props();

	let subjectComponentModalOpened = $state(false);

	let selectedComponentRefInTreeView: string | undefined = $state();

	function searchComponentInTreeView(id: string) {
		selectedComponentRefInTreeView = id;
	}
</script>

{#if bom}
	{#if bom.metadata?.component}
		<Tile>
			<div class="tile__content">
				<p>
					SBOM for <strong>{bom.metadata.component.name}</strong>
				</p>
				<Button
					size="small"
					icon={Document}
					iconDescription="Show details"
					kind="primary"
					on:click={() => (subjectComponentModalOpened = true)}
				/>
			</div>
		</Tile>
		<ComponentModal component={subjectComponentModalOpened ? bom.metadata.component : undefined} />
	{/if}
	{#if bom.components}
		<Tabs>
			<Tab label="Table" />
			<Tab label="Diagram" />
			<svelte:fragment slot="content">
				<TabContent>
					<ComponentsTreeView {bom} selectedComponentRef={selectedComponentRefInTreeView} />
					<ComponentsTable
						components={bom.components}
						searchComponent={searchComponentInTreeView}
					/>
				</TabContent>
				<TabContent>
					<ComponentsTree {bom} />
				</TabContent>
			</svelte:fragment>
		</Tabs>
	{/if}
{/if}

<style lang="scss">
	@use '@carbon/layout';

	.tile__content {
		display: flex;
		align-items: center;
		gap: layout.$spacing-03;
	}
</style>
