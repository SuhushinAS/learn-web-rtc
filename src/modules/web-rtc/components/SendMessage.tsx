import {getMessage} from 'modules/locale/helpers';
import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';

type TProps = {
  intl: IntlShape;
};

export class SendMessageComponent extends React.Component<TProps> {
  getMessage = getMessage(this.props.intl);

  render() {
    return (
      <form>
        <label htmlFor="message">{this.getMessage('webRTC.message.label')}</label>
        <input id="message" placeholder={this.getMessage('webRTC.message.placeholder')} type="text" />
        <button>{this.getMessage('webRTC.message.sendButton')}</button>
      </form>
    );
  }
}

export const SendMessage = injectIntl(SendMessageComponent);
