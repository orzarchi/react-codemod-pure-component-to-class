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

class FooWithBody extends React.Component {
  render() {
    return <div>foo</div>;
  }
}

class FooFunc extends React.Component {
  render() {
    return <div>foo</div>;
  }
}

class FooUnusedProps extends React.Component {
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


