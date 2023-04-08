import {getMessage} from 'modules/locale/helpers';
import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';

type TProps = {
  intl: IntlShape;
  onConnect: () => void;
  onDisconnect: () => void;
  // eslint-disable-next-line no-undef
  sendReadyState: RTCDataChannelState;
};

export class ControlComponent extends React.Component<TProps> {
  getMessage = getMessage(this.props.intl);
  msg = {
    connect: this.getMessage('webRTC.control.connectButton'),
    disconnect: this.getMessage('webRTC.control.disconnectButton'),
  };

  render() {
    return (
      <div>
        <button disabled={'closed' !== this.props.sendReadyState} onClick={this.props.onConnect} type="button">
          {this.msg.connect}
        </button>
        <button disabled={'open' !== this.props.sendReadyState} onClick={this.props.onDisconnect} type="button">
          {this.msg.disconnect}
        </button>
      </div>
    );
  }
}

export const Control = injectIntl(ControlComponent);
