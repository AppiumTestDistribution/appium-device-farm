import styled from 'styled-components';

type PropsType = {
  direction?: 'row' | 'column';
  align?: 'center' | 'flex-start';
  justify?: 'center' | 'flex-start';
};

const FlexContainer = styled.div<PropsType>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => props.align || 'center'};
  justify-content: ${(props) => props.justify || 'center'};
`;

export default FlexContainer;
