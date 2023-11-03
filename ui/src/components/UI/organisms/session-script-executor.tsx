import React, { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { js as jsBeautify } from 'js-beautify';
import { javascript } from '@codemirror/lang-javascript';
import SerialLayout, { Row } from '../layouts/serial-layout';
import Session from '../../../interfaces/session';
import styled from 'styled-components';
import Icon, { Sizes as IconSize } from '../atoms/icon';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDriverScriptResult,
  isDriverScriptExecutionPending,
} from '../../../store/selectors/entities/sessions-selector';
import {
  runDriverScript,
  sessionScriptExecutionReset,
} from '../../../store/actions/session-actions';
import Spinner, { Sizes } from '../atoms/spinner';
import _ from 'lodash';

const EDITOR_HEADER_HEIGHT_PX = 30;

const Container = styled.div<{ height: string }>`
  height: ${(props) => props.height};
  padding: 5px 10px 0px 10px;
`;

const FlexContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EditorContainer = styled.div<{ height?: string }>`
  height: ${(props) => props.height};

  & .cm-theme-dark,
  .cm-editor {
    height: 100%;
    font-size: 13px;
  }
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-items: center;
  flex-direction: column;
  background: #4f535a;
  border: 1px solid #6f747c;
`;

const EditorControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 15px;
  height: 100%;
  margin-right: 10px;

  & > .icon {
    cursor: pointer;
  }
`;

const TextWithIcon = styled.div`
  font-size: 11px;
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;

  & > span {
    padding-right: 5px;
    padding-top: 1px;
  }
`;

const RunButton = styled(TextWithIcon)`
  color: ${(props) => props.theme.colors.greyscale[6]};
  font-weight: 400;
  max-width: 120px;
`;

const ConsoleContainer = styled(Container)`
  padding: 0;
  display: flex:
  flex-direction: column;
`;

const ConsoleHeader = styled.div`
  height: 20px;
  background: #2a2121;
  border: 1px solid #666666;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  align-items: flex-start;
  justify-content: center;
`;

const ConsoleHeaderLabel = styled(TextWithIcon)`
  color: ${(props) => props.theme.colors.greyscale[6]};
  font-weight: 400;
  font-size: 11px;
`;

const ConsoleBody = styled.div`
  height: 100%;
  background: #282c34;
  overflow: auto;
  padding: 10px 0 10px 5px;
`;

const ConsoleEntry = styled.div<{ error: boolean }>`
  padding: 3px 3px 3px 3px;
  font-size: 11px;
  line-height: 20px;
  white-space: pre-wrap;

  color: ${(props) => (props.error ? '#e77a7a' : '#cfd6dc')};

  &:hover {
    background: #32383f;
  }
`;

type PropsType = {
  session: Session;
  parentHeight: number;
};

const DEFAULT_SCRIPT =
  '/* Run webdriver.io script using driver object ' +
  '\n* Avaliable objects are driver, console and Promise ' +
  '\n* Example: \n* await driver.$("~Login").click();' +
  '\n* console.log(await driver.$("~Title").getText());' +
  '\n*/\n';

export default function SessionScriptExecutor(props: PropsType) {
  const { session, parentHeight } = props;
  const dispatch = useDispatch();
  const isRunning = useSelector(isDriverScriptExecutionPending);
  const driverScriptResult = useSelector(getDriverScriptResult);
  const [script, setScript] = useState('');
  const [showConsole, setShowConsole] = useState(true);

  const onScriptChanged = (script: string) => {
    setScript(script);
  };

  const formatCode = () => {
    setScript(jsBeautify(script, { indent_size: 2, space_in_empty_paren: true }));
  };

  const getLogs = useCallback(() => {
    if (!driverScriptResult) {
      return [];
    }
    const logs: any = [];
    const rawLogs = [
      ...(driverScriptResult?.logs || []),
      { level: 'result', message: [driverScriptResult?.result] },
    ];

    console.log(rawLogs);
    rawLogs.filter(Boolean).forEach((l: any, index: number) => {
      l.message.forEach((m: any, mIndex: number) => {
        if (m && typeof m == 'object') {
          if (m.stack) {
            logs.push(
              <ConsoleEntry error key={`log-line-${index}-m-${mIndex}-stack`}>
                {m.stack}
              </ConsoleEntry>
            );
          } else {
            logs.push(
              <ConsoleEntry error={false} key={`log-line-${index}-m-${mIndex}-message`}>
                {JSON.stringify(m, null, 2)}
              </ConsoleEntry>
            );
          }
        } else {
          if (m && !_.isString(m)) {
            m = JSON.stringify(m);
          }
          logs.push(
            <ConsoleEntry error={false} key={`log-line-${index}-m-${mIndex}-message`}>
              {m || 'null'}
            </ConsoleEntry>
          );
        }
      });
    });
    return logs;
  }, [driverScriptResult]);

  useEffect(() => {
    dispatch(sessionScriptExecutionReset(null));
    setScript(DEFAULT_SCRIPT);
  }, [session.session_id]);

  const runScript = () => {
    dispatch(
      runDriverScript({
        sessionId: session.session_id,
        script: script,
      })
    );
  };

  return (
    <Container height={`calc(100vh - ${parentHeight}px)`}>
      <SerialLayout height="100%">
        <Row height={`${EDITOR_HEADER_HEIGHT_PX}px`}>
          <EditorHeader>
            <EditorControls>
              <Icon
                name="code-format"
                size={IconSize.S}
                color="#ffffff"
                tooltip={'Format code'}
                onClick={() => formatCode()}
              />
              <Icon
                name="terminal"
                size={IconSize.L}
                color="#ffffff"
                tooltip={showConsole ? 'Close console' : 'Open console'}
                onClick={() => setShowConsole(!showConsole)}
              />
              {isRunning ? (
                <RunButton>
                  <Spinner size={Sizes.XS} />
                  Running..
                </RunButton>
              ) : (
                <RunButton onClick={runScript}>
                  <Icon name="play" size={IconSize.S} color="#86ed86" tooltip="Run script" />
                  Run
                </RunButton>
              )}
            </EditorControls>
          </EditorHeader>
        </Row>
        <Row height={`calc(100vh - ${parentHeight + EDITOR_HEADER_HEIGHT_PX}px)`}>
          <FlexContainer>
            <EditorContainer height={!!showConsole ? '60%' : '100%'}>
              <CodeMirror
                placeholder={jsBeautify(DEFAULT_SCRIPT, {
                  indent_size: 2,
                  space_in_empty_paren: true,
                })}
                value={script}
                height="100"
                extensions={[javascript()]}
                onChange={(value) => {
                  onScriptChanged(value);
                }}
                theme="dark"
              />
            </EditorContainer>

            {!!showConsole && (
              <ConsoleContainer height="40%">
                <ConsoleHeader>
                  <ConsoleHeaderLabel>
                    <Icon name="terminal" size={IconSize.L} color="#ffffff" />
                    Console
                  </ConsoleHeaderLabel>
                </ConsoleHeader>
                <ConsoleBody>{getLogs()}</ConsoleBody>
              </ConsoleContainer>
            )}
          </FlexContainer>
        </Row>
      </SerialLayout>
    </Container>
  );
}
