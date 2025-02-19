import type { Bom } from '$lib/cyclonedx/models';
import { type TreeItem, TreeItemImpl } from '$lib/models/tree';

export function createTreeDataFromBom(bom: Bom): TreeItem[] {
	const componentRefToName = new Map<string, string>();
	const dependencyMap = new Map<string, string[]>();

	const data: TreeItem[] = [];

	for (const component of bom.components ?? []) {
		if (component['bom-ref']) {
			componentRefToName.set(component['bom-ref'], component.name);
		}
	}

	for (const dependency of bom.dependencies ?? []) {
		dependencyMap.set(dependency.ref, dependency.dependsOn ?? []);
	}

	const subject = bom.metadata?.component;

	const childrenCache = new Map<string, TreeItem[] | undefined>();

	function getChildTreeItems(componentRef: string, visited: Set<string>): TreeItem[] {
		// If we've already visited this component, return an empty array to prevent cycles
		if (visited.has(componentRef)) {
			console.warn(`Cycle detected for ${componentRef}`);
			return [];
		}

		// Mark the current component as visited
		visited.add(componentRef);

		return (dependencyMap.get(componentRef) ?? [])
			.map((child) => {
				if (componentRefToName.has(child)) {
					let children;
					if (childrenCache.has(child)) {
						children = childrenCache.get(child);
					} else {
						children = getChildTreeItems(child, new Set(visited));
						childrenCache.set(child, children);
					}
					return new TreeItemImpl(componentRefToName.get(child)!, child, children);
				} else {
					return null;
				}
			})
			.filter((child) => child !== null) as TreeItem[];
	}

	if (subject && subject['bom-ref']) {
		data.push(...getChildTreeItems(subject['bom-ref'], new Set<string>()));
	} else {
		console.error(`No subject found in ${bom.metadata}`);
	}

	return data;
}
