import React from 'react';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Dashboard from './components/pages/dashboard';
import PageNotFound from './components/pages/page-not-found';
import AppLoader from './components/UI/molecules/app-loader';
import { ThemeConfig } from './constants/themes';
import { AppState } from './store';
import ReduxActionTypes from './store/redux-action-types';
import { getSelectedTheme } from './store/selectors/ui/theme-selector';

const Container = styled.div`
  font-size: ${(props) => props.theme.fonts.size.L};
  color: ${(props) => props.theme.colors.greyscale[0]};
  background: ${(props) => props.theme.colors.greyscale[6]};
`;

type PropsType = {
  theme: ThemeConfig;
  isAppInitialised: boolean;
};

function AppRouter(props: PropsType) {
  const { theme, isAppInitialised } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: ReduxActionTypes.INIT_APP,
    });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {isAppInitialised ? (
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route element={<PageNotFound />} />
            </Routes>
          </Router>
        ) : (
          <AppLoader />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default connect((state: AppState) => {
  return {
    theme: getSelectedTheme(state),
    isAppInitialised: state.ui.appInitialised,
  };
})(AppRouter);
