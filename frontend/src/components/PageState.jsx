export function LoadingState({text = 'Загрузка…'}) {
  return (
    <div className="container page-pad">
      <div className="page-state">{text}</div>
    </div>
  );
}


export function ErrorState({message, onRetry}) {
  return (
    <div className="container page-pad">
      <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3">
        <span>{message}</span>
        {onRetry && (
          <button type="button" className="btn btn-sm btn-outline-light" onClick={onRetry}>
            Повторить
          </button>
        )}
      </div>
    </div>
  );
}
