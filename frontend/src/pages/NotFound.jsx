import {Link} from 'react-router-dom';


export default function NotFound() {
  return (
    <section className="container page-pad">
      <div className="not-found">
        <span className="eyebrow">Ошибка 404</span>
        <h1>Страница не найдена</h1>
        <p>Возможно, ссылка устарела или адрес был введён с ошибкой.</p>
        <Link className="btn btn-danger" to="/">На главную</Link>
      </div>
    </section>
  );
}
