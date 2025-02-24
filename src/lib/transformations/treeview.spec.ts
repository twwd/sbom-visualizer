import { describe, it, expect } from 'vitest';
import type { Bom } from '$lib/cyclonedx/models';
import { type TreeItem, TreeItemImpl } from '$lib/models/treeview';
import { createTreeDataFromBom } from '$lib/treeview';

describe('createTreeDataFromBom', () => {
	it('creates a tree structure from a basic BOM', () => {
		const bom: Bom = {
			metadata: {
				component: {
					'bom-ref': 'subject-ref',
					name: 'subject-name',
					type: 'application'
				}
			},
			components: [
				{
					'bom-ref': 'a-ref',
					type: 'library',
					name: 'a-name'
				},
				{
					'bom-ref': 'b-ref',
					type: 'library',
					name: 'b-name'
				},
				{
					'bom-ref': 'c-ref',
					type: 'library',
					name: 'c-name'
				},
				{
					'bom-ref': 'd-ref',
					type: 'library',
					name: 'd-name'
				}
			],
			dependencies: [
				{
					ref: 'subject-ref',
					dependsOn: ['a-ref', 'b-ref']
				},
				{
					ref: 'a-ref',
					dependsOn: ['c-ref', 'd-ref']
				},
				{
					ref: 'b-ref',
					dependsOn: []
				},
				{
					ref: 'c-ref',
					dependsOn: ['d-ref']
				}
			]
		};

		const expected: TreeItem[] = [
			new TreeItemImpl('a-name', 'a-ref', [
				new TreeItemImpl('c-name', 'c-ref', [new TreeItemImpl('d-name', 'd-ref')]),
				new TreeItemImpl('d-name', 'd-ref')
			]),
			new TreeItemImpl('b-name', 'b-ref')
		];

		expect(createTreeDataFromBom(bom)).toStrictEqual(expected);
	});
	it('can handle cycles in the BOM dependencies', () => {
		const bom: Bom = {
			metadata: {
				component: {
					'bom-ref': 'subject-ref',
					name: 'subject-name',
					type: 'application'
				}
			},
			components: [
				{
					'bom-ref': 'a-ref',
					type: 'library',
					name: 'a-name'
				},
				{
					'bom-ref': 'b-ref',
					type: 'library',
					name: 'b-name'
				}
			],
			dependencies: [
				{
					ref: 'subject-ref',
					dependsOn: ['a-ref']
				},
				{
					ref: 'a-ref',
					dependsOn: ['b-ref']
				},
				{
					ref: 'b-ref',
					dependsOn: ['a-ref']
				}
			]
		};

		const expected: TreeItem[] = [
			new TreeItemImpl('a-name', 'a-ref', [
				new TreeItemImpl('b-name', 'b-ref', [
					new TreeItemImpl('a-name', 'a-ref', [new TreeItemImpl('[cycle]', 'cycle')])
				])
			])
		];

		expect(createTreeDataFromBom(bom)).toStrictEqual(expected);
	});
});
