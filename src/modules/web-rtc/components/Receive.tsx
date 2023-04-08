import {getMessage} from 'modules/locale/helpers';
import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';

type TProps = {
  intl: IntlShape;
};

export class ReceiveComponent extends React.Component<TProps> {
  getMessage = getMessage(this.props.intl);

  render() {
    return (
      <div>
        <h6>{this.getMessage('webRTC.receive.title')}</h6>
      </div>
    );
  }
}

export const Receive = injectIntl(ReceiveComponent);
