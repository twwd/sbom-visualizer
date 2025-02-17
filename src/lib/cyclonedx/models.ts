export interface Dependency {
	ref: string;
	dependsOn?: string[];
}

export interface Bom {
	metadata?: Metadata;
	components?: Component[];
	dependencies?: Dependency[];
}

export interface Metadata {
	component?: Component;
}

export interface Component {
	type: ComponentType;
	'bom-ref'?: string;
	'mime-type'?: string;
	// supplier?: OrganizationalEntity;
	// manufacturer?: OrganizationalEntity;
	// authors?: OrganizationalContact[];
	// author?: string;
	// publisher?: string;
	group?: string;
	name: string;
	version?: string;
	// description?: string;
	scope?: ComponentScope;
	// hashes?: Hash[];
	// licenses?: LicenseChoice;
	// copyright?: string;
	// cpe?: string;
	purl?: string;
	// omniborId?: string[];
	// swhid?: string[];
	// swid?: Swid;
	// modified?: boolean;
	// pedigree?: ComponentPedigree;
	// externalReferences?: ExternalReference[];
	// components?: Component[];
	// evidence?: ComponentEvidence;
	// releaseNotes?: ReleaseNotes;
	// modelCard?: ModelCard;
	// data?: ComponentData[];
	// cryptoProperties?: CryptoProperties;
	// properties?: Property[];
	// tags?: Tags;
	// signature?: Signature;
}

type ComponentType =
	| 'application'
	| 'framework'
	| 'library'
	| 'container'
	| 'platform'
	| 'operating-system'
	| 'device'
	| 'device-driver'
	| 'firmware'
	| 'file'
	| 'machine-learning-model'
	| 'data'
	| 'cryptographic-asset';

type ComponentScope = 'required' | 'optional' | 'excluded';
