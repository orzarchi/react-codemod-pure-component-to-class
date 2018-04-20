'use strict';


module.exports = function (file, api, options) {
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };
  const j = api.jscodeshift;
  const ReactUtils = require('./ReactUtils')(j);
  let path = j(file.source);


  const findStatelessComponent = (j, path) => {
    return path.find(j.ExportDefaultDeclaration).declaration;
  };

  function getReactComponentNameSpecifier(path, parentClassName = 'Component') {
    const componentImport = ReactUtils.findReactComponentNameByParent(path, parentClassName);

    return componentImport
      ? j.identifier(componentImport)
      : j.memberExpression(
        j.identifier('React'),
        j.identifier(parentClassName),
        false
      )
  }

  function convertComponentBody(body) {
    body = body.type === "JSXElement" ? [j.returnStatement(body)] : body.body;
    body = body.type === "BlockStatement" ? body : j.blockStatement(body);

    j(body)
      .find(j.Identifier, {name: 'props'})
      .replaceWith(p => j.memberExpression(j.thisExpression(), j.identifier('props')));
    return body;
  }


  function hasJSXElement(ast) {
    return j(ast).find(j.JSXElement).size() > 0;

  }

  function toClassComponent(classNameIdentifier, decl) {
    if (decl.type !== 'ArrowFunctionExpression' ||
      (!hasJSXElement(decl.body) && decl.body.type !== "JSXElement")) {
      return false;
    }

    const body = convertComponentBody(decl.body);

    return j.classDeclaration(
      classNameIdentifier,
      j.classBody([
        j.methodDefinition('method',
          j.identifier('render'),
          j.functionExpression(null, [], body))
      ]),
      getReactComponentNameSpecifier(path)
    );
  }

  path
    .find(j.ExportDefaultDeclaration)
    .replaceWith(p => j.exportDefaultDeclaration(toClassComponent(null, p.value.declaration) || p.value));

  path
    .find(j.VariableDeclaration)
    .filter(p => p.value.declarations.length === 1)
    .replaceWith(p => toClassComponent(p.value.declarations[0].id, p.value.declarations[0].init) || p.value);

  return path.toSource(printOptions);
};
