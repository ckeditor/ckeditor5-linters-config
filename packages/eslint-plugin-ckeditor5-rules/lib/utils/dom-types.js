/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/**
 * Checks whether a type is, or extends, one of the given DOM interfaces. A type counts only when the interface is
 * declared by the TypeScript DOM library, so that a class of the same name elsewhere, such as the editor model's
 * `Document`, does not match.
 *
 * isDomType( type, new Set( [ 'Document' ] ), program ); // type of `element.ownerDocument` -> true
 */
function isDomType( type, names, program ) {
	const symbol = type.getSymbol();

	if ( names.has( symbol?.name ) &&
		symbol.declarations.some( declaration => program.isSourceFileDefaultLibrary( declaration.getSourceFile() ) )
	) {
		return true;
	}

	const target = type.target ?? type;

	return ( type.isIntersection() && type.types.some( member => isDomType( member, names, program ) ) ) ||
		( target.isClassOrInterface() &&
			program.getTypeChecker().getBaseTypes( target ).some( base => isDomType( base, names, program ) ) );
}

/**
 * Returns the members of a union, with a type parameter replaced by its constraint.
 */
function getUnionMembers( type, checker ) {
	const resolved = checker.getBaseConstraintOfType( type ) ?? type;

	return resolved.isUnion() ? resolved.types : [ resolved ];
}

module.exports = { isDomType, getUnionMembers };
