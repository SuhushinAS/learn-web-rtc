import {Control} from 'modules/web-rtc/components/Control';
import {Receive} from 'modules/web-rtc/components/Receive';
import {SendMessage} from 'modules/web-rtc/components/SendMessage';
import React from 'react';

type TProps = unknown;

type TState = {
  messages: string[];
  // eslint-disable-next-line no-undef
  sendReadyState: RTCDataChannelState;
  // eslint-disable-next-line no-undef
  receiveReadyState: RTCDataChannelState;
};

export class Connect extends React.Component<TProps, TState> {
  state: TState = {
    messages: [],
    receiveReadyState: 'closed',
    sendReadyState: 'closed',
  };
  private local: RTCPeerConnection = new RTCPeerConnection();
  private localChannel: RTCDataChannel = this.local.createDataChannel('localChannel');
  private remote: RTCPeerConnection = new RTCPeerConnection();
  private remoteChannel: RTCDataChannel = this.remote.createDataChannel('remoteChannel');

  onSendStatusChange = (e) => {
    this.setState({
      sendReadyState: e.currentTarget.readyState,
    });
  };

  onReceiveStatusChange = (e) => {
    this.setState({
      receiveReadyState: e.currentTarget.readyState,
    });
  };

  onRemoteMessage = (e: MessageEvent) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, e.data],
    }));
  };

  onRemoteDataChannel = (e: RTCDataChannelEvent) => {
    this.remoteChannel = e.channel;

    this.remoteChannel.addEventListener('message', this.onRemoteMessage);
    this.remoteChannel.addEventListener('open', this.onReceiveStatusChange);
    this.remoteChannel.addEventListener('close', this.onReceiveStatusChange);
  };

  onAddCandidateError = (e) => {
    console.log({e, log: 'onAddCandidateError'});
  };

  onLocalIceCandidate = (e: RTCPeerConnectionIceEvent) => {
    if (e.candidate) {
      this.remote.addIceCandidate(e.candidate).catch(this.onAddCandidateError);
    }
  };

  onRemoteIceCandidate = (e: RTCPeerConnectionIceEvent) => {
    if (e.candidate) {
      this.local.addIceCandidate(e.candidate).catch(this.onAddCandidateError);
    }
  };

  onCreateDescriptionError = (e) => {
    console.log({e, log: 'onCreateDescriptionError'});
  };

  localSetLocalDescription = (description) => {
    this.local.setLocalDescription(description);
    return description;
  };

  localSetRemoteDescription = (description) => {
    this.local.setRemoteDescription(description);
    return description;
  };

  remoteSetRemoteDescription = (description) => {
    this.remote.setRemoteDescription(description);
    return description;
  };

  remoteSetLocalDescription = (description) => {
    this.remote.setLocalDescription(description);
    return description;
  };

  remoteCreateAnswer = () => this.remote.createAnswer();

  onConnect = () => {
    this.local = new RTCPeerConnection();

    this.localChannel = this.local.createDataChannel('localChannel');
    this.localChannel.addEventListener('open', this.onSendStatusChange);
    this.localChannel.addEventListener('close', this.onSendStatusChange);

    this.remote = new RTCPeerConnection();
    this.remote.addEventListener('datachannel', this.onRemoteDataChannel);

    this.local.addEventListener('icecandidate', this.onLocalIceCandidate);

    this.remote.addEventListener('icecandidate', this.onRemoteIceCandidate);

    this.local
      .createOffer()
      .then(this.localSetLocalDescription)
      .then(this.remoteSetRemoteDescription)
      .then(this.remoteCreateAnswer)
      .then(this.remoteSetLocalDescription)
      .then(this.localSetRemoteDescription)
      .catch(this.onCreateDescriptionError);
  };

  onDisconnect = () => {
    this.localChannel.close();
    this.remoteChannel.close();
    this.local.close();
    this.remote.close();
  };

  onSend = (message: string) => {
    this.localChannel.send(message);
  };

  render() {
    return (
      <>
        <div>
          <Control
            onConnect={this.onConnect}
            onDisconnect={this.onDisconnect}
            sendReadyState={this.state.sendReadyState}
          />
        </div>
        <div>
          <SendMessage onSend={this.onSend} readyState={this.state.sendReadyState} />
        </div>
        <div>
          <Receive messages={this.state.messages} />
        </div>
      </>
    );
  }

  componentWillUnmount() {
    this.onDisconnect();
  }
}
