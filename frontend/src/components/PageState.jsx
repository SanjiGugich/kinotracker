export function LoadingState({text = 'Загрузка…', compact = false}) {
  const content = <div className="page-state">{text}</div>;

  if (compact) {
    return content;
  }

  return <div className="container page-pad">{content}</div>;
}


export function ErrorState({message, onRetry, compact = false}) {
  const content = (
    <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-light" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );

  if (compact) {
    return content;
  }

  return <div className="container page-pad">{content}</div>;
}
