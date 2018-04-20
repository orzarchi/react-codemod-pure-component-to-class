## Pure Component To class

A react [codemod](https://github.com/reactjs/react-codemod/) to transform stateless/pure/functional components to class components.

Based on:
* [react-pure-to-class](https://github.com/angryobject/react-pure-to-class)
* [js-transforms](https://github.com/jhgg/js-transforms/blob/master/pure-to-composite-component.js)
### Examples:

##### Before:
```javascript
export default ({foo, bar}) => (
  <div>{foo}</div>
)

let Foo = () => <div>foo</div>;

let FooFunc = function (){
  return <div>foo</div>;
};

let FooUsingProps = (props) => {
  const {
    item
  } = props;

  return <li>{item}{props.item2}</li>;
};

let FooUsingPropsWithDifferentName = (propsName) => {
  const {
    item
  } = propsName;

  return <li>{item}{propsName.item2}</li>;
};
```
##### After:
```javascript
export default class extends React.Component {
  render() {
    const {foo, bar} = this.props;
    return <div>{foo}</div>;
  }
}

class Foo extends React.Component {
  render() {
    return <div>foo</div>;
  }
}

class FooFunc extends React.Component {
  render() {
    return <div>foo</div>;
  }
}

class FooUsingProps extends React.Component {
  render() {
    const {
      item
    } = this.props;

    return <li>{item}{this.props.item2}</li>;
  }
}

class FooUsingPropsWithDifferentName extends React.Component {
  render() {
    const propsName = this.props;
    const {
      item
    } = propsName;

    return <li>{item}{propsName.item2}</li>;
  }
}

```