'use strict';


module.exports = function (file, api, options) {
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };
  const j = api.jscodeshift;
  const ReactUtils = require('./ReactUtils')(j);
  const path = j(file.source);


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

  function classComponent(p) {
    const decl = p.value.declarations[0];
    if (decl.init.type !== 'ArrowFunctionExpression' ||
      (!hasJSXElement(decl.init.body) && decl.init.body.type !== "JSXElement")) {
      return p.value;
    }

    const className = decl.id;
    const body = convertComponentBody(decl.init.body);


    // return statement`class ${decl.id} extends Component {
    //  render() { ${body} }
    // }`;

    return j.classDeclaration(
      className,
      j.classBody([
        j.methodDefinition('method',
          j.identifier('render'),
          j.functionExpression(null, [], body))
      ]),
      getReactComponentNameSpecifier(path)
    );
  }

  return path
    .find(j.VariableDeclaration)
    .filter(p => p.value.declarations.length === 1)
    .replaceWith(classComponent)
    .toSource(printOptions);
};
