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

		const parentChildren: TreeItemImpl[] = [];

		for (const child of dependencyMap.get(componentRef) ?? []) {
			if (componentRefToName.has(child)) {
				let childChildren;
				if (childrenCache.has(child)) {
					childChildren = childrenCache.get(child);
				} else {
					childChildren = getChildTreeItems(child, new Set(visited));
					childrenCache.set(child, childChildren);
				}
				parentChildren.push(new TreeItemImpl(componentRefToName.get(child)!, child, childChildren));
			}
		}

		return parentChildren;
	}

	if (subject && subject['bom-ref']) {
		data.push(...getChildTreeItems(subject['bom-ref'], new Set<string>()));
	} else {
		console.error(`No subject found in ${bom.metadata}`);
	}

	console.log('Successfully created tree');
	return data;
}
