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

class Item extends React.Component {
  render() {
    const {
      item
    } = this.props;

    return <li>{item}</li>;
  }
}

class Item2 extends React.Component {
  render() {
    const {
      item
    } = this.props;

    return <li>{item}</li>;
  }
}


