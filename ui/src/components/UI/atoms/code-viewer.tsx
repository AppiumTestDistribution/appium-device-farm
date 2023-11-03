import React from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import githubTheme from 'prism-react-renderer/themes/github';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';

const themes = {
  github: githubTheme,
  nightOwl: nightOwlTheme,
};

export const LineNo = styled.span`
  display: inline-block;
  width: 2em;
  user-select: none;
  opacity: 0.3;
`;

const Pre = styled.pre`
  text-align: left;
  margin: 5px 0;
  background: transparent !important;

  & {
    .token-line {
      white-space: break-spaces;
      word-break: break-all;
    }
  }
`;

const Container = styled(Highlight)``;

type PropsType = {
  code: string;
  language: Language;
  theme?: 'github' | 'nightOwl';
  lineNumber?: boolean;
};

export default function CodeViewer(props: PropsType) {
  const { code, language, theme = 'github', lineNumber = false } = props;

  return (
    <Container {...defaultProps} theme={themes[theme]} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {!!lineNumber && <LineNo>{i + 1}</LineNo>}
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Pre>
      )}
    </Container>
  );
}
