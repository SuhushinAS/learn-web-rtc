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

export class Remote extends React.Component<TProps, TState> {
  state: TState = {
    messages: [],
    readyState: 'closed',
  };
  private remote: RTCPeerConnection = new RTCPeerConnection();
  private channel: RTCDataChannel = this.remote.createDataChannel('channel');

  localChangeError(e) {
    console.log({e, log: 'localChangeError'});
  }

  localChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      this.setState(JSON.parse(event.currentTarget.value));
    } catch (error) {
      this.localChangeError(error);
    }
  };

  messageReceive = (e: MessageEvent) => {
    this.setState((state) => ({...state, messages: [...state.messages, e.data]}));
  };

  statusChange = (e) => {
    this.setState({readyState: e.currentTarget.readyState});
  };

  remoteDataChannel = (e: RTCDataChannelEvent) => {
    this.channel = e.channel;

    this.channel.addEventListener('message', this.messageReceive);
    this.channel.addEventListener('open', this.statusChange);
    this.channel.addEventListener('close', this.statusChange);
  };

  remoteCandidateChange = ({candidate}: RTCPeerConnectionIceEvent) => {
    if (candidate) {
      this.setState({remoteCandidate: candidate.toJSON()});
    }
  };

  answerCreate = () => this.remote.createAnswer();

  // eslint-disable-next-line no-undef
  answerChange = (answer: RTCSessionDescriptionInit) => {
    this.remote.setLocalDescription(answer);
    this.setState({answer});
  };

  answerCreateError = (e) => {
    console.log({e, log: 'answerCreateError'});
  };

  localCandidateAdd = () => {
    const {localCandidate} = this.state;

    if (localCandidate) {
      this.remote.addIceCandidate(localCandidate);
    }
  };

  connectionJoin = () => {
    const {offer} = this.state;
    if (offer) {
      this.remote = new RTCPeerConnection();

      this.remote.addEventListener('datachannel', this.remoteDataChannel);
      this.remote.addEventListener('icecandidate', this.remoteCandidateChange);

      this.remote
        .setRemoteDescription(offer)
        .then(this.answerCreate)
        .then(this.answerChange)
        .then(this.localCandidateAdd)
        .catch(this.answerCreateError);
    }
  };

  messageSend = (message: string) => {
    this.channel.send(message);
  };

  render() {
    const {answer, localCandidate, offer, readyState, remoteCandidate} = this.state;
    const local = JSON.stringify({localCandidate, offer});
    const remote = JSON.stringify({answer, remoteCandidate});

    return (
      <div>
        <h5>
          <Message id="webRTC.remote.title" />
        </h5>
        <div>
          <label htmlFor="local">
            <Message id="webRTC.connection.title" />
          </label>
          <input id="local" name="local" onChange={this.localChange} type="text" value={local} />
        </div>
        <div>
          <label htmlFor="remote">
            <Message id="webRTC.answer.title" />
          </label>
          <input id="remote" name="remote" readOnly type="text" value={remote} />
        </div>
        <div>
          <button disabled={Boolean(answer)} onClick={this.connectionJoin} type="button">
            <Message id="webRTC.connection.join" />
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
}
