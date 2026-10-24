export const siteOrigin = 'https://dance-and-friends-omsk.ru'

export const seoPages = [
  {
    path: '/',
    title: 'Dance and Friends Omsk — социальные танцы в Омске',
    description: 'Dance&Friends — сообщество социальных танцев в Омске. Линди-хоп, блюз и бальбоа, регулярные занятия, практики и вечеринки.',
  },
  {
    path: '/directions/',
    title: 'Направления танцев — Dance&Friends Омск',
    description: 'Линди-хоп, блюз и бальбоа в Dance&Friends в Омске: знакомьтесь с направлениями, смотрите видео танцев и выбирайте, с чего начать занятия',
  },
  {
    path: '/teachers/',
    title: 'Преподаватели — Dance&Friends Омск',
    description: 'Знакомьтесь с преподавателями Dance&Friends в Омске: их танцевальным опытом и подходом к занятиям. Узнайте, кто ведёт линди-хоп, блюз и бальбоа',
  },
  {
    path: '/price/',
    title: 'Стоимость занятий — Dance&Friends Омск',
    description: 'Стоимость занятий и абонементов Dance&Friends в Омске. Узнайте о пробном занятии, сроке действия абонемента, отмене занятий и способе оплаты',
  },
  {
    path: '/schedule/',
    title: 'Расписание занятий — Dance&Friends Омск',
    description: 'Расписание занятий Dance&Friends в Омске: линди-хоп, блюз и бальбоа для начинающих и продолжающих. Информация о наборе в группы и преподавателях',
  },
  {
    path: '/contacts/',
    title: 'Контакты Dance&Friends — социальные танцы в Омске',
    description: 'Свяжитесь с Dance&Friends в Омске по телефону или в соцсетях. Адрес студии: ул. Гагарина, 8/2, 4 этаж. Карта проезда и план залов Mad Family',
  },
] as const

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dance&Friends',
  alternateName: 'Dance and Friends Omsk',
  url: `${siteOrigin}/`,
  // Existing public site icon
  logo: `${siteOrigin}/android-chrome-512x512.png`,
  telephone: '+7 950 797-00-50',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressLocality: 'Омск',
    streetAddress: 'ул. Гагарина, 8/2, 4 этаж',
  },
  sameAs: [
    'https://vk.ru/danceandfriendsomsk',
    'https://t.me/danceandfriendsomsk',
  ],
}
