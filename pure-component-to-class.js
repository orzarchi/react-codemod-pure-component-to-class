'use strict';


module.exports = function (file, api, options) {
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };
  const j = api.jscodeshift;

  function createComponentBody(body) {
    body = j.BlockStatement.check(body)
      ? body
      : j.blockStatement([j.returnStatement(body)]);

    j(body)
      .find(j.Identifier, {name: 'props'})
      .replaceWith(() => j.memberExpression(j.thisExpression(), j.identifier('props')));


    return body;
  }

  const createPropsDecl = param => {
    if (!j.ObjectPattern.check(param) && param.name === 'props') {
      return null;
    }

    return j.variableDeclaration('const', [
      j.variableDeclarator(
        param,
        j.memberExpression(j.thisExpression(), j.identifier('props'))
      ),
    ]);
  };

  const areValidArguments = args => {
    const hasOneArgumentMax = args.length <= 1;
    const argumentIsIdentifierOrObjectPattern =
      !args[0] || j.Identifier.check(args[0]) || j.ObjectPattern.check(args[0]);

    return hasOneArgumentMax && argumentIsIdentifierOrObjectPattern;
  };

  function hasJSXElement(ast) {
    return j(ast).find(j.JSXElement).size() > 0;

  }

  const canBeReplaced = path => {
    const isFunc = [
      j.FunctionDeclaration,
      j.FunctionExpression,
      j.ArrowFunctionExpression
    ].some(x => x.check(path));
    const isJSX = hasJSXElement(path) || j.JSXElement.check(path);
    return isFunc && areValidArguments(path.params) && isJSX;
  };

  function toClassComponent(name, p) {
    if (!canBeReplaced(p)){
      return;
    }

    const param = p.params[0];
    const body = createComponentBody(p.body);

    if (param) {
      const propsDecl = createPropsDecl(param);
      if (propsDecl) {
        body.body.unshift(createPropsDecl(param));
      }
    }

    return j.classDeclaration(
      name,
      j.classBody([
        j.methodDefinition('method',
          j.identifier('render'),
          j.functionExpression(null, [], body))
      ]),
      j.memberExpression(
        j.identifier('React'),
        j.identifier('Component'),
        false
      )
    );
  }

  const path = j(file.source);

  path
    .find(j.ExportDefaultDeclaration)
    .replaceWith(p => j.exportDefaultDeclaration(toClassComponent(null, p.value.declaration) || p.value));

  path
    .find(j.VariableDeclaration)
    .filter(p => p.value.declarations.length === 1)
    .replaceWith(p => toClassComponent(p.value.declarations[0].id, p.value.declarations[0].init) || p.value);

  return path.toSource(printOptions);
};
