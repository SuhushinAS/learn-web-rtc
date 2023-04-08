import {getMessage} from 'modules/locale/helpers';
import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';

type TProps = {
  intl: IntlShape;
  messages: string[];
};

export class ReceiveComponent extends React.Component<TProps> {
  static defaultProps = {
    messages: [],
  };
  getMessage = getMessage(this.props.intl);

  render() {
    return (
      <div>
        <h6>{this.getMessage('webRTC.receive.title')}</h6>
        <ul>
          {this.props.messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export const Receive = injectIntl(ReceiveComponent);
