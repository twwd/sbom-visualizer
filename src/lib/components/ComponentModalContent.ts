import type { Component } from '$lib/cyclonedx/models';

export class ComponentModalContent {
	component?: Component;

	constructor(component?: Component) {
		this.component = component;
	}

	get heading() {
		return this.component?.name ?? '';
	}

	get code(): string {
		return JSON.stringify(this.component, null, 2);
	}
}