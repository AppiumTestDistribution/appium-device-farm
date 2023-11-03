import React from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { PLATFORM, STATUS } from '../../../constants/session';
import { getSessionFilters } from '../../../store/selectors/ui/filter-selector';
import Button from '../atoms/button';
import Input from '../atoms/input';
import Select from '../atoms/select';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import SerialLayout, { Row } from '../layouts/serial-layout';

const Container = styled.div`
  width: 400px;
  padding: 10px;
`;

const Label = styled.div``;

const Control = styled.div``;

const Actions = styled.div``;

const StyledButton = styled(Button)`
  && {
    margin: 0px 10px;
  }
`;

type Propstype = {
  onApply: (payload: any) => void;
};

export default function SessionListFilter(props: Propstype) {
  const { onApply } = props;
  const filterState = useSelector(getSessionFilters);
  const [name, setName] = useState(filterState.name);
  const [os, setOs] = useState(filterState.os);
  const [status, setStatus] = useState(filterState.status);
  const [device_udid, setUuid] = useState(filterState.device_udid);
  const [showClearButton, setShowClearButton] = useState(false);

  const apply = useCallback(() => {
    onApply({
      name,
      os,
      status: status,
      device_udid,
    });
  }, [name, os, status, device_udid]);

  const reset = useCallback(() => {
    onApply({
      name: '',
      os: [],
      status: [],
      device_udid: '',
    });
  }, [name, os, status, device_udid]);

  useEffect(() => {
    setShowClearButton([name, os, status, device_udid].some((val) => !!val));
  }, [name, os, status, device_udid]);

  return (
    <Container>
      <SerialLayout>
        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>Session ID:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Input onChange={(e) => setName(e.target.value)} value={name} />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>
        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>Platform:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Select
                  multiple={true}
                  options={PLATFORM}
                  onChange={(value) => setOs(value)}
                  selected={os}
                />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>
        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>Status:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Select
                  multiple={true}
                  options={STATUS}
                  onChange={(value) => setStatus(value)}
                  selected={status}
                />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>
        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>UDID:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Input onChange={(e) => setUuid(e.target.value)} value={device_udid} />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>
        <Row align="center" padding="20px 0px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Actions>
                <StyledButton onClick={apply}>Apply</StyledButton>
              </Actions>
            </Column>
            {showClearButton ? (
              <Column grid={6}>
                <Actions>
                  <StyledButton onClick={reset}>Clear</StyledButton>
                </Actions>
              </Column>
            ) : (
              <></>
            )}
          </ParallelLayout>
        </Row>
      </SerialLayout>
    </Container>
  );
}
