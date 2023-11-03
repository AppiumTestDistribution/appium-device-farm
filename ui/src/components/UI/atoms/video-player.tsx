import React from 'react';
import styled from 'styled-components';
import Button from './button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 10px;
`;

const VideoContainer = styled.div`
  height: 90%;
  width: 100%;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  max-height: 100%;
`;

const DownloadButton = styled.a`
  width: 50%;
  color: #fff;
  background: #6fc76b;
  padding: 5px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
`;

type PropsType = {
  session_id: string;
  url: string;
  downloadUrl: string;
  height?: number;
  width?: number;
};

export default function VideoPlayer(props: PropsType) {
  const { url, width, downloadUrl, session_id } = props;
  return (
    <Container>
      <VideoContainer>
        <StyledVideo
          className="react-player"
          src={url}
          width={width || '100%'}
          controls={true}
          controlsList="nodownload"
        />
      </VideoContainer>
      <DownloadButton href={downloadUrl} download={session_id}>
        Download Video
      </DownloadButton>
    </Container>
  );
}
