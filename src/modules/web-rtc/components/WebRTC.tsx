import {Message} from 'modules/locale/components/Message';
import {Local} from 'modules/web-rtc/components/Local';
import {Remote} from 'modules/web-rtc/components/Remote';
import React from 'react';

type TProps = unknown;

type TState = unknown;

export class WebRTC extends React.Component<TProps, TState> {
  render() {
    return (
      <div className="box">
        <h4>
          <Message id="webRTC.title" />
        </h4>
        <div className="box__row">
          <div className="box__col box__col_xs_12 box__col_md_6">
            <Local />
          </div>
          <div className="box__col box__col_xs_12 box__col_md_6">
            <Remote />
          </div>
        </div>
      </div>
    );
  }
}
