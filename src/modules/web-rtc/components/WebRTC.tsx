import {Message} from 'modules/locale/components/Message';
import {Home} from 'modules/web-rtc/components/Home';
import {Local} from 'modules/web-rtc/components/Local';
import {Remote} from 'modules/web-rtc/components/Remote';
import {webRTCPath} from 'modules/web-rtc/constants';
import React from 'react';
import {Route, Routes} from 'react-router-dom';

type TProps = unknown;

type TState = unknown;

export class WebRTC extends React.Component<TProps, TState> {
  render() {
    return (
      <div className="box">
        <h4>
          <Message id="webRTC.title" />
        </h4>
        <Routes>
          <Route element={<Local />} path={webRTCPath.local} />
          <Route element={<Remote />} path={webRTCPath.remote} />
          <Route element={<Home />} path={webRTCPath.home} />
        </Routes>
      </div>
    );
  }
}
