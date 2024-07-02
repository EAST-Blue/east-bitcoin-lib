const Network = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4 bg-gray-800 py-2 px-6">
        <div className="flex flex-row gap-x-1">
          <span>Network</span>
          <span className="font-bold">Regtest</span>
        </div>
        <div className="flex flex-row gap-x-1">
          <span>URI</span>
          <a href="https://regtest.btc.eastlayer.io" className="text-blue-400">
            https://regtest.btc.eastlayer.io
          </a>
          <button className="text-gray-500">
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Network;
