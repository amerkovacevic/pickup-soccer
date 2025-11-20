const LoadingState = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-primary-700">
      <span className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-tertiary-500 border-t-transparent" />
      <p className="text-sm">Getting the pitch ready...</p>
    </div>
  </div>
);

export default LoadingState;
