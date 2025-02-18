<script lang="ts">
	import {
		FileUploaderButton,
		FileUploaderItem,
	} from 'carbon-components-svelte';
	import Bom from '$lib/components/Bom.svelte';
	import { parseJson } from '$lib/cyclonedx/parse';

	let file: File | null = $state(null);

	function handleFile(e: CustomEvent<readonly File[]>) {
		if (e.detail.length > 0) {
			file = e.detail[0];
		}
	}
</script>

{#if file === null}
	<section class="uploader">
		<h1>SBOM Visualizer</h1>
		<p class="intro">Upload a CycloneDX BOM to get started!</p>
		<FileUploaderButton labelText="Upload SBOM" accept={['.json']} on:change={handleFile} />
	</section>
{:else}
	<h1 class="heading--loaded">SBOM Visualizer</h1>
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

	.heading--loaded {
		margin-left: layout.$spacing-04;
	}

	.intro {
		@include type.type-style('productive-heading-03');
		margin-bottom: layout.$spacing-06;
	}

	.uploader {
		margin: layout.$spacing-10;
	}
</style>
