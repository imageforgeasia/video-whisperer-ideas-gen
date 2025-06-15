
const VideoResultsLoading = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Fetching real YouTube results...</span>
    </div>
  );
};

export default VideoResultsLoading;
