import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import DeviceFarmApiService from '../../api-service';
import BuildsCard from './build-card';
import { SessionExplorer } from '../session-explorer';
import FlexContainer from '../../layouts/flex-container';

const Container = styled.div`
  height: 100vh;
  overflow: scroll;
  width: 400px;
  border-right: 1px solid #ecebf0;
`;

function extractBuildidFromUrl(url: string): string | null {
  const matches = url.match(new RegExp(/builds\/([^/]*)/));
  return matches?.length ? matches[1] : null;
}

export default function BuildsList() {
  const [builds, setBuilds] = useState([]);
  const location = useLocation();
  const [selectedBuild, setSelectedBuild] = useState(null) as any;
  const navigate = useNavigate();

  const refreshBuildList = async () => {
    const builds = await DeviceFarmApiService.getBuilds();
    setBuilds(builds);
  };

  useEffect(() => {
    const build_id = extractBuildidFromUrl(location.pathname);
    const buildFromUrl: any = build_id
      ? builds.find((s: any) => s.id === build_id) || builds[0]
      : builds[0];

    if (buildFromUrl && build_id != buildFromUrl.id) {
      navigate(`/builds/${buildFromUrl.id}`);
    }

    if (buildFromUrl && buildFromUrl.id != selectedBuild?.id) {
      setSelectedBuild(buildFromUrl);
    }
  }, [location, builds]);

  useEffect(() => {
    refreshBuildList();
    const buildPollingInternval = setInterval(refreshBuildList, 5000);
    return () => {
      clearInterval(buildPollingInternval);
    };
  }, []);

  return (
    <FlexContainer direction="row">
      <Container>
        {builds.map((b: any, i) => (
          <BuildsCard
            build={b}
            key={i}
            onClick={() => {
              navigate(`../builds/${b.id}`);
            }}
            active={selectedBuild && selectedBuild.id == b.id}
          />
        ))}
      </Container>
      {selectedBuild && <SessionExplorer />}
    </FlexContainer>
  );
}
