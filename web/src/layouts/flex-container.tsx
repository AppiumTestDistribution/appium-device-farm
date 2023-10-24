import styled from 'styled-components';

type PropsType = {
  direction?: 'row' | 'column';
};

const FlexContainer = styled.div<PropsType>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: center;
  justify-content: center;
`;

export default FlexContainer;
