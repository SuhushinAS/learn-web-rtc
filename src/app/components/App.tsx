import {appPath} from 'app/constants';
import {ExampleContainer} from 'modules/example/components/Example';
import {Home} from 'modules/home/components/Home';
import {Layout} from 'modules/layout/components/Layout';
import {WebRTC} from 'modules/web-rtc/components/WebRTC';
import React from 'react';
import {Route, Routes} from 'react-router-dom';

/**
 * Вывести приложение.
 * @return {*} приложение.
 */
export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route element={<ExampleContainer />} path={`${appPath.example}/*`} />
        <Route element={<Home />} path={appPath.home} />
        <Route element={<WebRTC />} path={`${appPath.webRTC}/*`} />
      </Routes>
    </Layout>
  );
};
