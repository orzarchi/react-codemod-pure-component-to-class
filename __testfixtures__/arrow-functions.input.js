export default ({foo, bar}) => (
  <div>{foo}</div>
)

let Foo = (props) => <div>foo</div>;

let Item = (props) => {
  const {
    item
  } = props;

  return <li>{item}</li>;
};

let Item2 = (propsName) => {
  const {
    item
  } = propsName;

  return <li>{item}</li>;
};


