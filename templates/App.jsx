import PropTypes from "prop-types";
import styled from "styled-components";

const Div = styled.div`
  color: #0000ff;
`;

/**
 * Component props
 *
 * @typedef {object} Props
 * @property {string} name Optional name
 */

/**
 * @param {Props} props Component props
 * @returns {React.FC} Functional Component
 */
export default function App({ name }) {
  const greet = name || "World";
  return <Div>Hello {greet}</Div>;
}

App.propTypes = {
  name: PropTypes.string,
};

App.defaultProps = {
  name: undefined,
};
