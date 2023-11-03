import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getSessions } from '../../../store/selectors/entities/sessions-selector';
import Button from '../atoms/button';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import { deleteAllSession as deleteAllSessionAction } from '../../../store/actions/session-actions';
import HeaderLogo from '../molecules/header-logo';

const Container = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;
`;

export default function AppHeader() {
  const sessions = useSelector(getSessions);
  const dispatch = useDispatch();

  const deleteAllSession = useCallback(() => {
    dispatch(deleteAllSessionAction());
  }, []);

  return (
    <Container>
      <ParallelLayout>
        <Column grid={3}>
          <HeaderLogo />
        </Column>
        {sessions.length > 0 ? (
          <Column grid={9}>
            <RightContainer>
              <Button onClick={deleteAllSession}>Delete all sessions</Button>
            </RightContainer>
          </Column>
        ) : (
          <></>
        )}
      </ParallelLayout>
    </Container>
  );
}
