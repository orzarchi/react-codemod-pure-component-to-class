export default ({foo, bar}) => (
  <div>{foo}</div>
)

let Foo = () => <div>foo</div>;

let FooWithBody = () => {
  return <div>foo</div>;
};

let FooFunc = function (){
  return <div>foo</div>;
};

let FooUnusedProps = (props) => <div>foo</div>;

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


