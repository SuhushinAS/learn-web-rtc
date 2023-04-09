import {appPath} from 'app/constants';
import {Message} from 'modules/locale/components/Message';
import {webRTCPath} from 'modules/web-rtc/constants';
import React from 'react';
import {Link} from 'react-router-dom';

type TProps = unknown;

type TState = unknown;

export class Home extends React.Component<TProps, TState> {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={`${appPath.webRTC}${webRTCPath.local}`}>
              <Message id="webRTC.local.title" />
            </Link>
          </li>
          <li>
            <Link to={`${appPath.webRTC}${webRTCPath.remote}`}>
              <Message id="webRTC.remote.title" />
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
