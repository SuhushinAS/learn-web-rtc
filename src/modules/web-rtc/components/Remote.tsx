import {Message} from 'modules/locale/components/Message';
import {Receive} from 'modules/web-rtc/components/Receive';
import {SendMessage} from 'modules/web-rtc/components/SendMessage';
import React, {ChangeEvent} from 'react';

type TProps = unknown;

type TState = {
  answer: string;
  localCandidate: string;
  message: string;
  messages: string[];
  offer: string;
  // eslint-disable-next-line no-undef
  readyState: RTCDataChannelState;
  remoteCandidate: string;
};

export class Remote extends React.Component<TProps, TState> {
  state: TState = {
    answer: JSON.stringify(null),
    localCandidate: JSON.stringify(null),
    message: '',
    messages: [],
    offer: JSON.stringify(null),
    readyState: 'closed',
    remoteCandidate: JSON.stringify(null),
  };
  private remote: RTCPeerConnection = new RTCPeerConnection();
  private channel: RTCDataChannel = this.remote.createDataChannel('channel');

  offerChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      offer: e.currentTarget.value,
    });
  };

  offerGet() {
    try {
      return JSON.parse(this.state.offer);
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  messageReceive = (e: MessageEvent) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, e.data],
    }));
  };

  statusChange = (e) => {
    this.setState({
      readyState: e.currentTarget.readyState,
    });
  };

  remoteDataChannel = (e: RTCDataChannelEvent) => {
    this.channel = e.channel;

    this.channel.addEventListener('message', this.messageReceive);
    this.channel.addEventListener('open', this.statusChange);
    this.channel.addEventListener('close', this.statusChange);
  };

  remoteCandidateChange = ({candidate}: RTCPeerConnectionIceEvent) => {
    if (candidate) {
      this.setState({
        remoteCandidate: JSON.stringify(candidate.toJSON()),
      });
    }
  };

  answerCreate = () => this.remote.createAnswer();

  // eslint-disable-next-line no-undef
  answerChange = (answer: RTCSessionDescriptionInit) => {
    this.remote.setLocalDescription(answer);
    this.setState({answer: JSON.stringify(answer)});
  };

  answerCreateError = (e) => {
    console.log({e, log: 'answerCreateError'});
  };

  connect(offer) {
    this.remote = new RTCPeerConnection();

    this.remote.addEventListener('datachannel', this.remoteDataChannel);
    this.remote.addEventListener('icecandidate', this.remoteCandidateChange);

    this.remote
      .setRemoteDescription(offer)
      .then(this.answerCreate)
      .then(this.answerChange)
      .catch(this.answerCreateError);
  }

  receiveOffer = () => {
    const offer = this.offerGet();

    if (offer) {
      this.connect(offer);
    }
  };

  localCandidateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      localCandidate: e.currentTarget.value,
    });
  };

  localCandidateSet = () => {
    // eslint-disable-next-line no-undef
    const candidate: RTCIceCandidateInit = JSON.parse(this.state.localCandidate);
    this.remote.addIceCandidate(new RTCIceCandidate(candidate));
  };

  messageSend = (message: string) => {
    this.channel.send(message);
  };

  render() {
    const {answer, localCandidate, offer, readyState, remoteCandidate} = this.state;
    return (
      <div>
        <h4>
          <Message id="webRTC.remote.title" />
        </h4>
        <div>
          <label htmlFor="offer">
            <Message id="webRTC.offer.title" />
          </label>
          <input id="offer" name="offer" onChange={this.offerChange} type="text" value={offer} />
        </div>
        <div>
          <button onClick={this.receiveOffer} type="button">
            <Message id="webRTC.offer.get" />
          </button>
        </div>
        <div>
          <label htmlFor="answer">
            <Message id="webRTC.answer.title" />
          </label>
          <input id="answer" name="offer" readOnly type="text" value={answer} />
        </div>
        <div>
          <label htmlFor="remoteCandidate">
            <Message id="webRTC.candidate.title" />
          </label>
          <input
            id="remoteCandidate"
            name="remoteCandidate"
            onChange={this.localCandidateChange}
            type="text"
            value={localCandidate}
          />
        </div>
        <div>
          <label htmlFor="localCandidate">
            <Message id="webRTC.candidate.title" />
          </label>
          <input id="localCandidate" name="localCandidate" readOnly type="text" value={remoteCandidate} />
        </div>
        <div>
          <button onClick={this.localCandidateSet} type="button">
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
}
