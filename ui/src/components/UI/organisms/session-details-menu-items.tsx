import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Session from '../../../interfaces/session';
import Icon, { Sizes } from '../atoms/icon';
import Spinner, { Sizes as SpinnerSize } from '../atoms/spinner';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteSession,
  setSelectedSession,
  pauseSession,
  resumeSession,
} from '../../../store/actions/session-actions';
import {
  isSessionDeleting,
  getSessionDeleteResponse,
  getSessionStateChangeResponse,
  isStateChangePending,
} from '../../../store/selectors/entities/sessions-selector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  padding: 0 30px 0px 0;
  display: flex;
  justify-content: end;
  align-items: center;
  color: #fff;
  & .icon {
    cursor: pointer;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  height: 25px !important;
  gap: 12px;
`;

const IconContainer = styled.div`
  margin-left: 20px;
`;

type PropsType = {
  session: Session;
  paused: boolean;
  debugging: boolean;
  onStateChanged: (state: boolean) => any;
  onDebuggingToggled: (state: boolean) => any;
};

export default function sessionMenuItems(props: PropsType) {
  const { session, paused, debugging, onStateChanged, onDebuggingToggled } = props;
  const dispatch = useDispatch();
  const deletePending = useSelector(isSessionDeleting);
  const stateChangePending = useSelector(isStateChangePending);
  const deleteResponse = useSelector(getSessionDeleteResponse);
  const stateChangeResponse = useSelector(getSessionStateChangeResponse);

  const debugToggleChange = (state: boolean) => {
    if (!!state) {
      !paused && onPause(session.session_id);
    } else {
      onResume(session.session_id);
    }
    onDebuggingToggled(state);
  };

  const onDelete = useCallback((id: string) => {
    dispatch(deleteSession(id));
  }, []);

  const onPause = useCallback((id: string) => {
    dispatch(pauseSession(id));
  }, []);

  const onResume = useCallback((id: string) => {
    dispatch(resumeSession(id));
  }, []);

  useEffect(() => {
    if (deleteResponse && deleteResponse.success) {
      dispatch(setSelectedSession(null));
    }
  }, [deleteResponse]);

  useEffect(() => {
    if (!stateChangeResponse) {
      return;
    }

    if (stateChangeResponse.success) {
      onStateChanged(!paused);
    } else {
      toast.error(stateChangeResponse.message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      if (debugging) {
        onDebuggingToggled(!debugging);
      }
    }
  }, [stateChangeResponse]);

  function getPlayPauseIcon() {
    if (debugging) {
      return <></>;
    }
    if (paused) {
      return (
        <Icon
          name="play"
          tooltip="Resume"
          size={Sizes.XL}
          onClick={() => onResume(session.session_id)}
        ></Icon>
      );
    } else {
      return (
        <Icon
          name="pause"
          tooltip="Pause"
          size={Sizes.XL}
          onClick={() => onPause(session.session_id)}
        ></Icon>
      );
    }
  }

  function getDebuggerIcon() {
    if (!debugging) {
      return (
        <Icon
          name="debug"
          tooltip="Pause & Debug"
          size={Sizes.XL}
          onClick={() => debugToggleChange(true)}
        ></Icon>
      );
    } else {
      return (
        <Icon
          name="stop"
          tooltip="Stop debugging"
          size={Sizes.XL}
          onClick={() => debugToggleChange(false)}
        ></Icon>
      );
    }
  }

  return (
    <Container>
      <ToastContainer />
      <IconGroup>
        {/* Show pause/play icon only if the session is still running */}
        {!session.is_completed &&
          (stateChangePending ? <Spinner size={SpinnerSize.S} /> : getPlayPauseIcon())}

        {!session.is_completed && getDebuggerIcon()}
        {/* Show delete icon only if the session execution is completed */}
        {session.is_completed &&
          (deletePending ? (
            <Spinner size={SpinnerSize.S} />
          ) : (
            <IconContainer>
              <Icon
                name="delete"
                tooltip="Delete"
                size={Sizes.L}
                onClick={() => onDelete(session.session_id)}
              ></Icon>
            </IconContainer>
          ))}
      </IconGroup>
    </Container>
  );
}
