import {Message} from 'modules/locale/components/Message';
import {Receive} from 'modules/web-rtc/components/Receive';
import {SendMessage} from 'modules/web-rtc/components/SendMessage';
import React, {ChangeEvent} from 'react';

type TProps = unknown;

type TState = {
  answer: string;
  localCandidate: string;
  messages: string[];
  offer: string;
  // eslint-disable-next-line no-undef
  readyState: RTCDataChannelState;
  remoteCandidate: string;
};

export class Local extends React.Component<TProps, TState> {
  state: TState = {
    answer: JSON.stringify(null),
    localCandidate: JSON.stringify(null),
    messages: [],
    offer: JSON.stringify(null),
    readyState: 'closed',
    remoteCandidate: JSON.stringify(null),
  };
  private local: RTCPeerConnection = new RTCPeerConnection();
  private channel: RTCDataChannel = this.local.createDataChannel('channel');

  statusChange = (e) => {
    this.setState({readyState: e.currentTarget.readyState});
  };

  // eslint-disable-next-line no-undef
  offerChange = (offer: RTCSessionDescriptionInit) => {
    this.local.setLocalDescription(offer);
    this.setState({offer: JSON.stringify(offer)});
  };

  localCandidateChange = ({candidate}: RTCPeerConnectionIceEvent) => {
    if (candidate) {
      this.setState({localCandidate: JSON.stringify(candidate.toJSON())});
    }
  };

  offerCreateError = (e) => {
    console.log({e, log: 'offerCreateError'});
  };

  offerCreate = () => {
    this.local = new RTCPeerConnection();

    this.channel = this.local.createDataChannel('channel');

    this.channel.addEventListener('message', this.messageReceive);
    this.channel.addEventListener('open', this.statusChange);
    this.channel.addEventListener('close', this.statusChange);
    this.local.addEventListener('icecandidate', this.localCandidateChange);

    this.local.createOffer().then(this.offerChange).catch(this.offerCreateError);
  };

  answerChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({answer: e.currentTarget.value});
  };

  remoteCandidateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({remoteCandidate: e.currentTarget.value});
  };

  remoteCandidateSet = () => {
    // eslint-disable-next-line no-undef
    const candidate: RTCIceCandidateInit = JSON.parse(this.state.remoteCandidate);
    this.local.addIceCandidate(new RTCIceCandidate(candidate));
  };

  answerGet() {
    try {
      return JSON.parse(this.state.answer);
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  answerSet = () => {
    const answer = this.answerGet();

    if (answer) {
      this.local.setRemoteDescription(answer);
    }
  };

  messageSend = (message: string) => {
    this.channel.send(message);
  };

  messageReceive = (e: MessageEvent) => {
    this.setState((state) => ({...state, messages: [...state.messages, e.data]}));
  };

  render() {
    const {answer, offer, localCandidate, readyState, remoteCandidate} = this.state;
    return (
      <div>
        <h5>
          <Message id="webRTC.local.title" />
        </h5>
        <div>
          <button onClick={this.offerCreate} type="button">
            <Message id="webRTC.offer.create" />
          </button>
        </div>
        <div>
          <label htmlFor="offer">
            <Message id="webRTC.offer.title" />
          </label>
          <input id="offer" name="offer" readOnly type="text" value={offer} />
        </div>
        <div>
          <label htmlFor="answer">
            <Message id="webRTC.answer.title" />
          </label>
          <input id="answer" name="answer" onChange={this.answerChange} type="text" value={answer} />
        </div>
        <div>
          <button onClick={this.answerSet} type="button">
            <Message id="webRTC.answer.get" />
          </button>
        </div>
        <div>
          <label htmlFor="localCandidate">
            <Message id="webRTC.candidate.title" />
          </label>
          <input id="localCandidate" name="localCandidate" readOnly type="text" value={localCandidate} />
        </div>
        <div>
          <label htmlFor="remoteCandidate">
            <Message id="webRTC.candidate.title" />
          </label>
          <input
            id="remoteCandidate"
            name="remoteCandidate"
            onChange={this.remoteCandidateChange}
            type="text"
            value={remoteCandidate}
          />
        </div>
        <div>
          <button onClick={this.remoteCandidateSet} type="button">
            <Message id="webRTC.candidate.setButton" />
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
