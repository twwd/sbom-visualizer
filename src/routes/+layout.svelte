<script lang="ts">
	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		Modal,
		SkipToContent,
		Theme
	} from 'carbon-components-svelte';
	import { LogoGithub, SettingsAdjust } from 'carbon-icons-svelte';
	import 'carbon-components-svelte/css/all.css';
	import type { CarbonTheme } from 'carbon-components-svelte/src/Theme/Theme.svelte';
	import { setContext } from 'svelte';

	let { children } = $props();

	let settingsOpen = $state(false);
	let theme: CarbonTheme = $state('g10');

	setContext('theme', () => theme);
</script>

<svelte:head>
	<title>SBOM Visualizer</title>
</svelte:head>

<Header platformName="SBOM Visualizer">
	<svelte:fragment slot="skipToContent">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction
			iconDescription="Settings"
			tooltipAlignment="center"
			icon={SettingsAdjust}
			on:click={() => (settingsOpen = true)}
		/>
		<HeaderGlobalAction
			iconDescription="GitHub"
			tooltipAlignment="end"
			icon={LogoGithub}
			href="https://github.com/twwd/sbom-visualizer"
			target="_blank"
			rel="noopener"
		/>
	</HeaderUtilities>
</Header>

<Content>
	{@render children()}
</Content>

<Modal bind:open={settingsOpen} passiveModal modalHeading="Settings">
	<h4>Dark Mode</h4>
	<div class="settings-entry">
		<Theme
			render="toggle"
			bind:theme
			persist
			persistKey="__carbon-theme"
			toggle={{ themes: ['g10', 'g100'] }}
		/>
	</div>
</Modal>

<style lang="scss">
	@use '@carbon/layout';
	.settings-entry {
		padding: layout.$spacing-02 0;
	}
</style>
