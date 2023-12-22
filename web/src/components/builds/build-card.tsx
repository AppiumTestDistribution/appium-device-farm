import styled from 'styled-components';
import FlexContainer from '../../layouts/flex-container';

const Container = styled.div`
  padding: 10px;
  width: 95%;
  border-bottom: 1px solid #bdbdbd;
  border-right: 1px solid #bdbdbd;
  display: flex;
  flex-direction: column;
  gap: 25px;
  background: #f0f4f7;
  cursor: pointer;

  &:hover {
    background-color: #cccccc;
  }

  &.active {
    background-color: #abd2ed;
  }
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
  color: rgb(61, 59, 59);
  display: inline-block;
  padding-bottom: 10px;
`;

export default function BuildsCard(props: { build: any; active?: boolean; onClick?: any }) {
  const { build, active, onClick } = props;

  return (
    <Container className={active ? 'active' : ''} onClick={onClick}>
      <Title>{build.name}</Title>
    </Container>
  );
}
