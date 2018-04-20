function hasReact(path) {
  return (
    hasModule(path, 'React') ||
    hasModule(path, 'react') ||
    hasModule(path, 'react/addons') ||
    hasModule(path, 'react-native')
  );
}


module.exports = j => ({
  hasModule(path, module) {
    return path
        .findVariableDeclarators()
        .filter(j.filters.VariableDeclarator.requiresModule(module))
        .size() === 1 ||
      path
        .find(j.ImportDeclaration, {
          type: 'ImportDeclaration',
          source: {
            type: 'Literal',
          },
        })
        .filter(declarator => declarator.value.source.value === module)
        .size() === 1
  },

  findReactComponentNameByParent(path, parentClassName) {
    const reactImportDeclaration = path
      .find(j.ImportDeclaration, {
        type: 'ImportDeclaration',
        source: {
          type: 'Literal',
        },
      })
      .filter(importDeclaration => hasReact(path));

    const componentImportSpecifier = reactImportDeclaration
      .find(j.ImportSpecifier, {
        type: 'ImportSpecifier',
        imported: {
          type: 'Identifier',
          name: parentClassName,
        },
      }).at(0);

    const paths = componentImportSpecifier.paths();
    return paths.length
      ? paths[0].value.local.name
      : undefined;
  }
})
