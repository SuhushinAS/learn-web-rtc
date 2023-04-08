import {getMessage} from 'modules/locale/helpers';
import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';

type TProps = {
  intl: IntlShape;
};

export class ControlComponent extends React.Component<TProps> {
  getMessage = getMessage(this.props.intl);

  render() {
    return (
      <div>
        <button>{this.getMessage('webRTC.control.connectButton')}</button>
        <button>{this.getMessage('webRTC.control.disconnectButton')}</button>
      </div>
    );
  }
}

export const Control = injectIntl(ControlComponent);
