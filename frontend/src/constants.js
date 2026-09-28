export const MOVIE_STATUSES = [
  {value: 'planned', label: 'Хочу посмотреть'},
  {value: 'watching', label: 'Смотрю'},
  {value: 'watched', label: 'Просмотрено'},
  {value: 'postponed', label: 'Отложено'},
  {value: 'dropped', label: 'Брошено'},
];

export const STATUS_LABELS = Object.fromEntries(
  MOVIE_STATUSES.map(({value, label}) => [value, label])
);
