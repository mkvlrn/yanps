import styled from "styled-components";

const Div = styled.div`
  color: #0000ff;
`;

interface Props {
  name?: string;
}

export default function App({ name }: Props) {
  const greet = name;
  return <Div>Hello {greet}</Div>;
}

App.defaultProps = {
  name: "World",
} as Partial<Props>;
