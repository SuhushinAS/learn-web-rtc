import {getMessage} from 'modules/locale/helpers';
import React, {ChangeEvent, FormEvent} from 'react';
import {injectIntl, IntlShape} from 'react-intl';

type TProps = {
  intl: IntlShape;
  onSend: (message: string) => void;
  // eslint-disable-next-line no-undef
  sendReadyState: RTCDataChannelState;
};

type TState = {
  canInput: boolean;
  canSubmit: boolean;
  message: string;
};

export class SendMessageComponent extends React.Component<TProps, TState> {
  getMessage = getMessage(this.props.intl);
  msg = {
    label: this.getMessage('webRTC.message.label'),
    placeholder: this.getMessage('webRTC.message.placeholder'),
    sendButton: this.getMessage('webRTC.message.sendButton'),
  };
  state = {
    canInput: false,
    canSubmit: false,
    message: '',
  };

  static getDerivedStateFromProps(props, state) {
    const canInput = 'open' === props.sendReadyState;
    const canSubmit = canInput && '' !== state.message;

    return {
      ...state,
      canInput,
      canSubmit,
    };
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({message: e.target.value});
  };

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.props.onSend(this.state.message);
    this.setState({message: ''});
  };

  render() {
    const {canInput, canSubmit, message} = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="message">{this.msg.label}</label>
        <input
          disabled={!canInput}
          id="message"
          onChange={this.onChange}
          placeholder={this.msg.placeholder}
          type="text"
          value={message}
        />
        <button disabled={!canSubmit} type="submit">
          {this.msg.sendButton}
        </button>
      </form>
    );
  }
}

export const SendMessage = injectIntl(SendMessageComponent);
