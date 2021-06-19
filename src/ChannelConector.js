import {useMemo} from 'react';

export const ChannelConector = ({inputRef, onSubscribe, channels, onRemoveChannel}) => {
  const renderChannels = useMemo(() => {
    return channels.map(channel => {
      return (
        <div className="md:w-6/12 lg:w-4/12 w-full mb-4" key={channel.uuid}>
          <div className="p-2 border mx-2">
            <div className="text-lg py-2 border-b overflow-hidden truncate">Listening to {channel.name}</div>
            <div className="h-96 bg-gray-300 overflow-hidden overflow-y-auto">
              <pre id={`messages_${channel.uuid}`} />
            </div>
            {channel.status === 'connected' && <div className="mt-3 text-right">
              <button className="px-3 bg-red-600 text-white focus:outline-none rounded-md border h-10" onClick={() => onRemoveChannel(channel)}>
                Unsubscribe
              </button>
            </div>}
          </div>
        </div>
      )
    })
  }, [channels]);

  return (
    <div className="mt-10">
      <div className="flex md:flex-wrap md:flex-row flex-col">
        {renderChannels}
      </div>
      <div>
        <input className="bg-gray-200 focus:outline-none p-2 w-60" placeholder="Enter Channel Name" ref={inputRef} />
        <button className="px-3 w-32 mx-2 h-10 bg-blue-500 text-white focus:outline-none rounded-md border" onClick={onSubscribe}>
          Subscribe
        </button>
      </div>
    </div>
  )
}