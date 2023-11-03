import React, { useCallback } from 'react';
import styled from 'styled-components';
import SelectComponent from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useMemo } from 'react';
import CommonUtils from '../../../utils/common-utils';
import _ from 'lodash';

const Container = styled.div``;

const StyledSelect = styled(SelectComponent)`
  width: 100%;
  font-size: 12px !important;

  & > .MuiSelect-select {
    padding: 7px 10px;
  }

  .MuiMenuItem-root {
    font-size: 12px !important;
  }
`;

type Option = {
  label: string;
  value: string;
};

type PropsType = {
  options: Array<Option | string>;
  selected?: Option | string | Array<string>;
  onChange?: (e: any) => void;
  multiple?: boolean;
};

const getOption = (option: Option | string) => {
  if (typeof option === 'string') {
    return {
      value: option,
      label: option,
    };
  } else {
    return option;
  }
};

function getValue(isMultiple: boolean, value: any) {
  if (!value) {
    return [];
  }
  if (isMultiple && _.isString(value)) {
    return value.split(',');
  } else {
    return value;
  }
}

export default function Select(props: PropsType) {
  const { options, selected, onChange, multiple = false } = props;
  const massagedOption = useMemo(() => options.map(getOption), [CommonUtils.hash(options)]);

  const onSelectChange = useCallback((e) => {
    onChange && onChange(e.target.value);
  }, []);

  return (
    <Container>
      <StyledSelect
        onChange={onSelectChange}
        value={getValue(multiple, selected)}
        multiple={multiple}
      >
        {massagedOption.map((option: Option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </Container>
  );
}
