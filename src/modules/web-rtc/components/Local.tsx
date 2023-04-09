import {Message} from 'modules/locale/components/Message';
import {Receive} from 'modules/web-rtc/components/Receive';
import {SendMessage} from 'modules/web-rtc/components/SendMessage';
import React, {ChangeEvent} from 'react';

type TProps = unknown;

type TState = {
  // eslint-disable-next-line no-undef
  answer?: RTCSessionDescriptionInit;
  // eslint-disable-next-line no-undef
  localCandidate?: RTCIceCandidateInit;
  messages: string[];
  // eslint-disable-next-line no-undef
  offer?: RTCSessionDescriptionInit;
  // eslint-disable-next-line no-undef
  readyState: RTCDataChannelState;
  // eslint-disable-next-line no-undef
  remoteCandidate?: RTCIceCandidateInit;
};

export class Local extends React.Component<TProps, TState> {
  state: TState = {
    messages: [],
    readyState: 'closed',
  };
  private local: RTCPeerConnection = new RTCPeerConnection();
  private channel: RTCDataChannel = this.local.createDataChannel('channel');

  statusChange = (e) => {
    this.setState({readyState: e.currentTarget.readyState});
  };

  // eslint-disable-next-line no-undef
  offerChange = (offer: RTCSessionDescriptionInit) => {
    this.local.setLocalDescription(offer);
    this.setState({offer});
  };

  localCandidateChange = ({candidate}: RTCPeerConnectionIceEvent) => {
    if (candidate) {
      this.setState({localCandidate: candidate.toJSON()});
    }
  };

  offerCreateError = (e) => {
    console.log({e, log: 'offerCreateError'});
  };

  connectionCreate = () => {
    this.local = new RTCPeerConnection();

    this.channel = this.local.createDataChannel('channel');

    this.channel.addEventListener('message', this.messageReceive);
    this.channel.addEventListener('open', this.statusChange);
    this.channel.addEventListener('close', this.statusChange);
    this.local.addEventListener('icecandidate', this.localCandidateChange);

    this.local.createOffer().then(this.offerChange).catch(this.offerCreateError);
  };

  remoteChangeError(e) {
    console.log({e, log: 'remoteChangeError'});
  }

  remoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      this.setState(JSON.parse(event.currentTarget.value));
    } catch (error) {
      this.remoteChangeError(error);
    }
  };

  remoteSet = () => {
    const {answer, remoteCandidate} = this.state;

    if (answer && remoteCandidate) {
      this.local.setRemoteDescription(answer);
      this.local.addIceCandidate(remoteCandidate);
    }
  };

  messageSend = (message: string) => {
    this.channel.send(message);
  };

  messageReceive = (e: MessageEvent) => {
    this.setState((state) => ({...state, messages: [...state.messages, e.data]}));
  };

  render() {
    const {answer, localCandidate, offer, readyState, remoteCandidate} = this.state;
    const local = JSON.stringify({localCandidate, offer});
    const remote = JSON.stringify({answer, remoteCandidate});

    return (
      <div>
        <h5>
          <Message id="webRTC.local.title" />
        </h5>
        <div>
          <label htmlFor="local">
            <Message id="webRTC.connection.title" />
          </label>
          <input id="local" name="local" readOnly type="text" value={local} />
        </div>
        <div>
          <label htmlFor="remote">
            <Message id="webRTC.answer.title" />
          </label>
          <input id="remote" name="remote" onChange={this.remoteChange} type="text" value={remote} />
        </div>
        <div>
          <button disabled={Boolean(offer)} onClick={this.connectionCreate} type="button">
            <Message id="webRTC.connection.create" />
          </button>{' '}
          <button disabled={'closed' !== readyState} onClick={this.remoteSet} type="button">
            <Message id="webRTC.answer.get" />
          </button>
        </div>
        <div>
          <SendMessage onSend={this.messageSend} readyState={readyState} />
        </div>
        <div>
          <Receive messages={this.state.messages} />
        </div>
      </div>
    );
  }

  disconnect = () => {
    this.channel.close();
    this.local.close();
  };

  componentWillUnmount() {
    this.disconnect();
  }
}
