<script lang="ts">
	import { FileUploaderDropContainer, FileUploaderItem } from 'carbon-components-svelte';
	import Bom from '$lib/components/Bom.svelte';
	import { parseJson } from '$lib/cyclonedx/parse';

	let file: File | null = $state(null);

	function handleFile(e: CustomEvent<readonly File[]>) {
		if (e.detail.length > 0) {
			file = e.detail[0];
		}
	}
</script>

<h1>SBOM Visualizer</h1>

{#if file === null}
	<p class="intro">Upload a CycloneDX BOM to get started!</p>
	<FileUploaderDropContainer
		labelText="Drag and drop a BOM here or click to upload"
		validateFiles={(files: ReadonlyArray<File>) => {
			return files.filter((file) => file.type === 'application/json');
		}}
		accept={['.json']}
		on:change={handleFile}
	/>
{:else}
	<FileUploaderItem name={file.name} status="edit" on:delete={() => (file = null)} />

	{#await file.text() then fileContent}
		<Bom bom={parseJson(fileContent)}></Bom>
	{/await}
{/if}

<style lang="scss">
	@use '@carbon/layout';
	@use '@carbon/type';

	h1 {
		margin-bottom: layout.$spacing-05;
	}

	.intro {
		@include type.type-style('productive-heading-04');
		margin-bottom: layout.$spacing-05;
	}
</style>
