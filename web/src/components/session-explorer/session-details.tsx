import DeviceFarmApiService from '../../api-service';
import FlexContainer from '../../layouts/flex-container';
import SessionCapabilityDetails from './session-capabilities';

export default function SessionDetails(props: { session: any }) {
  return (
    <FlexContainer
      direction="column"
      style={{
        height: '100vh',
        maxWidth: '100%',
        alignItems: 'flex-start',
      }}
    >
      <FlexContainer
        style={{
          width: '30%',
        }}
        direction="column"
      >
        <FlexContainer
          style={{
            height: '50%',
          }}
          direction="row"
        >
          <video
            src={DeviceFarmApiService.getAssetUrl(props.session.video_recording)}
            autoPlay={false}
            controls
            style={{
              height: '100%',
              width: 'auto',
              background: 'transparent',
            }}
          />
        </FlexContainer>
        <SessionCapabilityDetails session={props.session} />
      </FlexContainer>
      <SessionCapabilityDetails session={props.session} />
    </FlexContainer>
  );
}
