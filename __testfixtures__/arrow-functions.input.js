export default ({foo, bar}) => (
  <div>{foo}</div>
)

let Item = (props) => {
  const {
    item
  } = props;

  return <li>{item}</li>;
};

let X = (props) => <div>foo</div>;
