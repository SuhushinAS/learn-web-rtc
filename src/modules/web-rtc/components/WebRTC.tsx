import {Message} from 'modules/locale/components/Message';
import {Control} from 'modules/web-rtc/components/Control';
import {Receive} from 'modules/web-rtc/components/Receive';
import {SendMessage} from 'modules/web-rtc/components/SendMessage';
import React from 'react';

export class WebRTC extends React.Component {
  render() {
    return (
      <div className="box">
        <h4>
          <Message id="webRTC.title" />
        </h4>
        <div>
          <Control />
        </div>
        <div>
          <SendMessage />
        </div>
        <div>
          <Receive />
        </div>
      </div>
    );
  }
}
