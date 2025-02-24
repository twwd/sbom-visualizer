import type { Bom } from '$lib/cyclonedx/models';
import { type TreeItem, TreeItemImpl } from '$lib/models/treeview';

const PlaceholderTreeItemForCycle: TreeItem = new TreeItemImpl('[cycle]', 'cycle');

export function createTreeDataFromBom(bom: Bom, maxDepth: number = 4): TreeItem[] {
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

	let nodeCount = 1;

	function getChildTreeItems(
		componentRef: string,
		visited: Set<string>,
		maxDepth: number
	): TreeItem[] {
		// Mark the current component as visited
		visited.add(componentRef);

		const parentChildren: TreeItem[] = [];

		for (const childRef of dependencyMap.get(componentRef) ?? []) {
			let childName = componentRefToName.get(childRef);
			if (childName) {
				let childChildren;
				if (maxDepth <= 0) {
					console.warn('Maximum depth reached');
					childName += '…';
					childChildren = [];
				} else if (visited.has(childRef)) {
					// If we've already visited this component, return placeholder to prevent cycles
					console.warn(`Cycle detected for ${componentRef}`);
					childChildren = [PlaceholderTreeItemForCycle];
				} else if (childrenCache.has(childRef)) {
					childChildren = childrenCache.get(childRef);
				} else {
					childChildren = getChildTreeItems(childRef, new Set(visited), maxDepth - 1);
					childrenCache.set(childRef, childChildren);
				}
				nodeCount++;
				parentChildren.push(new TreeItemImpl(childName, childRef, childChildren));
			}
		}

		return parentChildren;
	}

	if (subject && subject['bom-ref']) {
		data.push(...getChildTreeItems(subject['bom-ref'], new Set<string>(), maxDepth));
	} else {
		console.error(`No subject found in ${bom.metadata}`);
	}

	console.log(`Successfully created a tree with ${nodeCount} nodes`);
	return data;
}
