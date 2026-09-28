export const POSTERS = {
  "1917": "/posters/1917-2019.webp",
  "Новый Человек-паук": "/posters/amazing-spider-man-2012.webp",
  "Новый Человек-паук: Высокое напряжение": "/posters/amazing-spider-man-2-2014.webp",
  "Барби": "/posters/barbie-2023.webp",
  "Бегущий по лезвию 2049": "/posters/blade-runner-2049.webp",
  "Побег из Шоушенка": "/posters/shawshank-redemption-1994.webp",
  "Дюна": "/posters/dune-2021.webp",
  "Дюна: Часть вторая": "/posters/dune-part-two-2024.webp",
  "Всё везде и сразу": "/posters/everything-everywhere-all-at-once-2022.webp",
  "Бойцовский клуб": "/posters/fight-club-1999.webp",
  "Форрест Гамп": "/posters/forrest-gump-1994.webp",
  "Зелёная миля": "/posters/green-mile-1999.webp",
  "Начало": "/posters/inception-2010.webp",
  "Интерстеллар": "/posters/interstellar-2014.webp",
  "Джокер": "/posters/joker-2019.webp",
  "Достать ножи": "/posters/knives-out-2019.webp",
  "Ла-Ла Ленд": "/posters/la-la-land-2016.webp",
  "Властелин колец: Возвращение короля": "/posters/lord-of-the-rings-return-of-the-king-2003.webp",
  "Безумный Макс: Дорога ярости": "/posters/mad-max-fury-road-2015.webp",
  "Матрица": "/posters/matrix-1999.webp",
  "Оппенгеймер": "/posters/oppenheimer-2023.webp",
  "Паразиты": "/posters/parasite-2019.webp",
  "Криминальное чтиво": "/posters/pulp-fiction-1994.webp",
  "Человек-паук": "/posters/spider-man-2002.webp",
  "Человек-паук 2": "/posters/spider-man-2-2004.webp",
  "Человек-паук 3: Враг в отражении": "/posters/spider-man-3-2007.webp",
  "Человек-паук: Паутина вселенных": "/posters/spider-man-across-the-spider-verse-2023.webp",
  "Человек-паук: Вдали от дома": "/posters/spider-man-far-from-home-2019.webp",
  "Человек-паук: Возвращение домой": "/posters/spider-man-homecoming-2017.webp",
  "Человек-паук: Через вселенные": "/posters/spider-man-into-the-spider-verse-2018.webp",
  "Человек-паук: Нет пути домой": "/posters/spider-man-no-way-home-2021.webp",
  "Тёмный рыцарь": "/posters/the-dark-knight-2008.webp",
  "Отель «Гранд Будапешт»": "/posters/the-grand-budapest-hotel-2014.webp",
  "ВАЛЛ·И": "/posters/wall-e-2008.webp",
  "Одержимость": "/posters/whiplash-2014.webp"
};


export function posterFor(movie) {
  return POSTERS[movie?.title] || "";
}
