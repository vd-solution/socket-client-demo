import {useState, useCallback, useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import SocketClient from 'socketcluster-wrapper-client';
import {Spinner} from './Spinner';
import {ChannelConector} from './ChannelConector';

const options = {
  secure: true,
  authType: 'ws'
}

const addMessages = (identifier, data) => {
  const element = document.getElementById(`messages_${identifier}`);
  const node = document.createElement("div");
  node.className = "border-b py-2 whitespace-pre-wrap";
  const textnode = document.createTextNode(`${+ new Date()} : ${JSON.stringify(data)}`);
  node.appendChild(textnode); 
  element.appendChild(node)
  element.parentNode.scrollTop = element.scrollHeight;
}

function App() {
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const channelRef = useRef({});
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isConnect, setIsConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState([]);

  const onChangeApiKey = (e) => setApiKey(e.target.value);
  const channelSubscription = async (name) => {
    const index = channels.findIndex(obj => obj.name.toLowerCase() === name.toLowerCase());
    if(index > -1) return;
    const identifier = uuidv4();
    channelRef.current[identifier] = socketRef.current.subscribe(name);
    setChannels(prev => {
      return [...prev, {name, uuid: identifier, status: 'connected'}];
    });

    for await (let data of channelRef.current[identifier]) {
      addMessages(identifier, data)
    }
  }

  const onConnectSocket = async () => {
    setIsLoading(true);
    try {
      const client = new SocketClient(apiKey, options)
      socketRef.current = await client.connect()
      setIsConnect(true);
      setIsLoading(false);
      setError(false);
    } catch (err) {
      setError(err.message)
      setIsLoading(false);
    }
  }
  const onDisconnectSocket = async () => {
    setIsLoading(true);
    try {
      await socketRef.current.disconnect();
      setIsConnect(false);
      setIsLoading(false);
      setApiKey('');
    } catch(err) {
      console.log(err)
      window.location.reload();
    }
  }

  const onConnectHandler = useCallback(() => {
    if(!apiKey) return;
    isConnect ? onDisconnectSocket() : onConnectSocket();
  }, [isConnect, apiKey]);

  const onClickSubscribe = () => {
    const listenerName = inputRef.current.value;
    if(listenerName) {
      channelSubscription(listenerName);
      inputRef.current.value = '';
    }
  }

  const onRemoveChannel = (channel) => {
    if(channelRef.current[channel.uuid]) {
      channelRef.current[channel.uuid].unsubscribe()
    };

    setChannels(prev => {
      return prev.map(obj => {
        if(obj.uuid === channel.uuid) {
          obj.status = 'disconnectd';
        }
        return obj;
      })
    });
  }

  return (
    <>
      <header className="App-header">
        <div className="text-center p-4 text-lg border-b">Socket Client Testing</div>
      </header>
      <div className="px-10 py-5">
        <div className="flex items-center justify-end text-sm">
          Connection Status <div className={`mx-2 w-4 h-4 ${isConnect ? 'bg-green-600': 'bg-red-600 '} rounded-full`} /> {isConnect ? 'Connected' : 'Disconnected'}
        </div>
        <div className="text-center">
          <input className="bg-gray-200 focus:outline-none p-2 w-80" placeholder="Your API KEY" readOnly={isConnect || isLoading} value={apiKey} onChange={onChangeApiKey} />
          <button className={`ml-3 px-3 w-32 h-10 ${isConnect ? 'bg-red-600' : 'bg-green-400'} text-white focus:outline-none rounded-md border border-gray-300`} onClick={onConnectHandler} disabled={isLoading}>
            <div className="flex items-center justify-center">
              <Spinner animate={isLoading} /> {isConnect ? 'Disconnect' : 'Connect'}
            </div>
          </button>
        </div>
        {error && <div className="text-center text-red-500 text-sm">{error}</div>}
        {
          isConnect && <ChannelConector inputRef={inputRef} channels={channels} onSubscribe={onClickSubscribe} onRemoveChannel={onRemoveChannel} />
        }
      </div>
    </>
  );
}

export default App;
