export function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
