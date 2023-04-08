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

type TState = {
  canConnect: boolean;
  canDisconnect: boolean;
};

export class ControlComponent extends React.Component<TProps, TState> {
  getMessage = getMessage(this.props.intl);
  msg = {
    connect: this.getMessage('webRTC.control.connectButton'),
    disconnect: this.getMessage('webRTC.control.disconnectButton'),
  };

  static getDerivedStateFromProps({sendReadyState}: TProps): TState {
    return {
      canConnect: 'closed' === sendReadyState,
      canDisconnect: 'open' === sendReadyState,
    };
  }

  render() {
    return (
      <div>
        <button disabled={!this.state.canConnect} onClick={this.props.onConnect} type="button">
          {this.msg.connect}
        </button>
        <button disabled={!this.state.canDisconnect} onClick={this.props.onDisconnect} type="button">
          {this.msg.disconnect}
        </button>
      </div>
    );
  }
}

export const Control = injectIntl(ControlComponent);
