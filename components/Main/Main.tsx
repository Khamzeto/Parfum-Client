'use client';

import { Carousel } from '@mantine/carousel';
import { CardCustom } from '../ui/CardCarousel/Card';
import {
  Image,
  Text,
  Badge,
  Group,
  Button,
  Avatar,
  useMantineTheme,
  Card,
  Stack,
  Title,
  ActionIcon,
  Center,
  rem,
  useMantineColorScheme,
  Grid,
  Divider,
  Rating,
  SimpleGrid,
  Skeleton,
} from '@mantine/core';
import {
  IconAward,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCrown,
  IconEye,
  IconHeart,
  IconLeaf,
  IconMapPin,
  IconMessageCircle,
  IconPlus,
  IconShare,
  IconShoppingBag,
  IconStar,
  IconThumbUp,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react';
import '@mantine/carousel/styles.css';
import { Header } from '../Header/Header';
import InputSearch from '../ui/InputSearch/InputSearch';
import './Main.css'; // Подключаем стили, если они есть в файле Main.css
import { useMediaQuery } from '@mantine/hooks';
import classes from '../ui/CardCarousel/Card.module.css';
import Link from 'next/link';
import { ArticleCardFooter } from '../ui/ArticleCardFooter/ArticleCardFooter';
import { FooterLinks } from '../ui/Footer/Footer';

import { RightMain } from '../ui/RightMain/RightMain';
import { LeftMain } from '../ui/LeftMain/LeftMain';
import { useEffect, useState } from 'react';
import $api from '../api/axiosInstance';
import { useRouter } from 'next/navigation';
import LazyLoad from 'react-lazyload';
const stores = [
  {
    id: 1,
    name: 'Тионета',
    url: 'www.tioneta.ru',
    location: 'Вся Россия',
    image: 'https://your-image-url.com/tioneta.jpg',
    rating: 4,
    likes: 9,
    comments: 17,
  },
  {
    id: 2,
    name: 'Aromamore',
    url: 'www.aromamore.ru',
    location: 'Вся Россия',
    image: 'https://your-image-url.com/aromamore.jpg',
    rating: 2,
    likes: 83,
    comments: 17,
  },
];

const posts = [
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 2,
    title: 'Как выбрать парфюм?',
    author: 'Jane Smith',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Советы, которые помогут вам выбрать идеальный аромат.',
  },
  {
    id: 3,
    title: 'Как выбрать парфюм?',
    author: 'Jane Smith',
    image:
      'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Советы, которые помогут вам выбрать идеальный аромат.',
  },
];

const perfume = [
  {
    _id: 1,
    perfume_id: '47577',
    name: 'Bleu de Chanel',
    image: 'https://parfumetrika.ru/images/Bleu%20de%20Chanel_main_1725370434426.jpg',
    type: 'Eau de Parfum',
    rating_value: 4.5,
    rating_count: 120,
    release_year: 2018,
    gender: 'male',
    brand: 'Chanel',
  },
  {
    _id: '672e88b03599aafaa185e01b',
    perfume_id: '2852',
    name: 'Lalique',
    image: 'https://parfumetrika.ru/images/Lalique_main_1731102894896.jpg',
    type: 'Парфюмированная вода',
    rating_value: 7.5,
    rating_count: 212,
    release_year: 1992,
    gender: 'female',
    brand: 'Lalique',
  },
  {
    _id: '673d536d3599aafaa1911114',
    perfume_id: '13140',
    name: 'Godolphin',
    image: 'https://parfumetrika.ru/images/Godolphin_main_1732072294838.jpg',
    type: 'Парфюмированная вода',
    rating_value: 7.9,
    rating_count: 832,
    release_year: 2011,
    gender: 'male',
    brand: 'Parfums de Marly',
  },
  {
    _id: '66e5d6e3a0ed7975759adde0',
    perfume_id: '91824',
    name: 'Psychedelic Love',
    image: 'https://parfumetrika.ru/images/Psychedelic Love_main_1726338784823.jpg',
    type: 'Парфюмированная вода',
    rating_value: 8.1,
    rating_count: 598,
    release_year: 2017,
    gender: 'unisex',
    brand: 'Initio',
  },
  {
    _id: '672e8c153599aafaa185e4e2',
    perfume_id: '52451',
    name: 'Noir Premier - Élégance Animale 1989',
    image:
      'https://parfumetrika.ru/images/Noir Premier - Élégance Animale 1989_main_1731103764970.jpg',
    type: 'Парфюмированная вода',
    rating_value: 7.1,
    rating_count: 95,
    release_year: 2014,
    gender: 'unisex',
    brand: 'Lalique',
  },
];
const perfumes = [
  {
    _id: 1,
    perfume_id: '13889',
    name: 'Dior Homme Intense',
    image: 'https://parfumetrika.ru/images/Dior%20Homme%20Intense_main_1725285062742.jpg',
    type: 'Парфюмированная вода',
  },
  {
    _id: 2,
    perfume_id: '174',
    name: 'Fahrenheit',
    image: 'https://parfumetrika.ru/images/Fahrenheit_main_1725285872040.jpg',
    type: 'Туалетная вода',
  },
  {
    _id: 3,
    perfume_id: '4564',
    name: 'Bloom',
    image: 'https://parfumetrika.ru/images/Ambre%20Nuit_main_1725229186723.jpg',
    type: 'Парфюмированная вода',
  },

  // Add more perfumes as needed...
];
const popularBrands = [
  {
    name: 'Gucci',
    logo: (isDark: boolean) => (
      <a href="/brand/Gucci">
        <svg
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          width="100" // Adjust width as needed
          height="auto"
        >
          <defs>
            <style>{'.cls-1{fill-rule:evenodd;}'}</style>
          </defs>
          <g id="Logos">
            <path
              className="cls-1"
              fill={isDark ? '#FFFFFF' : '#000000'} // Dynamically setting fill color based on theme
              d="M35,20a10.4,10.4,0,0,1-15,9.31,10.38,10.38,0,1,1,0-18.64A10.43,10.43,0,0,1,35,20Zm-2,0a8.35,8.35,0,0,0-8.34-8.34A8.24,8.24,0,0,0,22.1,12a10.26,10.26,0,0,1,3.32,5.17H23.28A8.31,8.31,0,0,0,20,13a8.29,8.29,0,0,0-3.25,4.18H14.61A10.48,10.48,0,0,1,17.94,12a8.67,8.67,0,0,0-2.53-.38,8.34,8.34,0,0,0,0,16.68,8.11,8.11,0,0,0,2.49-.38,10.23,10.23,0,0,1-3.63-7.12h4.94v2l-2.41,0a8.34,8.34,0,0,0,3.21,4,8.34,8.34,0,0,0,3.21-4l-2.41,0v-2h4.94a10.31,10.31,0,0,1-3.67,7.1,8.48,8.48,0,0,0,2.53.4A8.3,8.3,0,0,0,33,20Z"
            />
          </g>
        </svg>
      </a>
    ),
  },
  {
    name: 'Gucci3',
    logo: (isDark: boolean) => (
      <a href="/brand/Acqua_di_Parma">
        <Image
          src="/acqua-di.svg"
          alt="Gucci3 Logo"
          miw={65}
          width={80} // Укажите необходимые размеры
          height={80} // Обязательно укажите высоту
        />
      </a>
    ),
  },
  {
    name: 'Gucci5',
    logo: (isDark: boolean) => (
      <a href="/brand/Dior">
        <Image
          src="/cdi.svg"
          alt="Gucci4 Logo"
          miw={100}
          width={30} // Укажите необходимые размеры
          height={30} // Обязательно укажите высоту
        />
      </a>
    ),
  },
  {
    name: 'Gucci6',
    logo: (isDark: boolean) => (
      <a href="/brand/Guerlain">
        <Image
          src="/guerlain.svg"
          alt="Gucci4 Logo"
          miw={100}
          width={100} // Укажите необходимые размеры
          height={100} // Обязательно укажите высоту
        />
      </a>
    ),
  },
  {
    name: 'Gucci7',
    logo: (isDark: boolean) => (
      <a href="/brand/Lancome">
        <Image
          src="/logo-4.svg"
          alt="Gucci4 Logo"
          miw={104}
          width={30} // Укажите необходимые размеры
          height={30} // Обязательно укажите высоту
          style={{ cursor: 'pointer' }}
        />
      </a>
    ),
  },
  {
    name: 'Gucci47',
    logo: (isDark: boolean) => (
      <a href="/brand/Chanel">
        <Image
          src="/chanel.svg"
          alt="Gucci4 Logo"
          miw={100}
          width={16} // Укажите необходимые размеры
          height={16} // Обязательно укажите высоту
        />
      </a>
    ),
  },

  // Add more brands here...
];
const firstBrand = popularBrands[0];

export default function Main() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme } = useMantineColorScheme(); // Get color scheme
  const isDark = colorScheme === 'dark'; // Check if the theme is dark
  const [recentPerfumes, setRecentPerfumes] = useState([]);
  const [newsPerfumes, setNewsPerfumes] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [recentlyViewedPerfumes, setRecentlyViewedPerfumes] = useState([]);
  console.log(recentlyViewedPerfumes);
  console.log(recentlyViewedPerfumes);
  const getImageSource = (coverImage) => {
    // Проверяем, начинается ли строка с "data:image/" (признак Base64)
    if (coverImage?.startsWith('data:image/')) {
      return coverImage;
    }
    // Если это не Base64, предполагаем, что это путь
    return `https://hltback.parfumetrika.ru${coverImage || '/images/placeholder.jpg'}`;
  };

  // Функция для загрузки просмотренных духов из localStorage
  useEffect(() => {
    const storedPerfumes = JSON.parse(localStorage.getItem('viewedPerfumes') || '[]');
    setRecentlyViewedPerfumes(storedPerfumes);
  }, []);
  useEffect(() => {
    const fetchRecentPerfumes = async () => {
      try {
        const response = await $api.get('/perfumes/recent');
        setRecentPerfumes(response.data.perfumes);
      } catch (error) {
        console.error('Ошибка при получении последних парфюмов:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    const fetchNewsPerfumes = async () => {
      try {
        const response = await $api.get('/news/popular');
        setNewsPerfumes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при получении последних парфюмов:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    const fetchLatestNews = async () => {
      try {
        const response = await $api.get('/news/latest');
        setLatestNews(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при получении последних парфюмов:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    const fetchLatestArticles = async () => {
      try {
        const response = await $api.get('/article/latest');
        setLatestArticles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при получении последних парфюмов:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestArticles();
    fetchLatestNews();
    fetchNewsPerfumes();
    fetchRecentPerfumes();
  }, []);

  return (
    <>
      <Header />

      <div className="main-container">
        <div className="main-content">
          <h2 style={{ marginTop: '0px', marginBottom: '30px' }}>Последние парфюмы</h2>
          <Carousel
            slideSize="10%"
            align="start"
            slideGap="0"
            classNames={classes}
            loop
            slidesToScroll={1}
            style={{ marginTop: '20px', marginBottom: '40px' }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Carousel.Slide key={index}>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'left',
                        gap: '20px',
                        minWidth: '20px',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          height: 50,
                          minWidth: '32%',
                          backgroundColor: '#fff',
                          display: 'flex',
                          justifyContent: 'center',
                          borderRadius: '12px',
                          maxWidth: '68px',
                        }}
                      >
                        <Skeleton height={50} width={50} circle />
                      </div>
                      <div>
                        <Skeleton height={10} width={80} radius="xs" />
                        <Skeleton height={10} width={120} mt={5} radius="xs" />
                      </div>
                    </div>
                  </Carousel.Slide>
                ))
              : recentPerfumes.map((perfume) => (
                  <Carousel.Slide key={perfume._id}>
                    <Link
                      href={`/perfumes/${perfume.perfume_id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        key={perfume._id}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'left',
                          gap: '20px',
                          minWidth: '20px',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            height: 50,
                            minWidth: '32%',
                            backgroundColor: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            maxWidth: '68px',
                          }}
                        >
                          <Image
                            src={`https://parfumetrika.ru/${perfume.main_image}`}
                            alt={perfume.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/roman.jpg';
                            }}
                            fit="contain"
                            width="30px"
                          />
                        </div>
                        <div>
                          <Text
                            weight={500}
                            w="2px"
                            align="center"
                            size="xs"
                            style={{
                              color: theme.colors.gray[6],
                            }}
                          >
                            {perfume.brand}
                          </Text>
                          <Text weight={500} w="200px" align="left" size="xs">
                            {perfume.name}
                          </Text>
                        </div>
                      </div>
                    </Link>
                  </Carousel.Slide>
                ))}
          </Carousel>

          {/* News Section */}
          <div
            style={{
              display: 'flex',
              maxWidth: '1440px',
              gap: '2%',
              alignItems: 'flex-start',
              paddingLeft: '20px',
              paddingRight: '20px',
              justifyContent: 'center',
            }}
          >
            <div className="posts-container">
              <LeftMain perfume={perfume} posts={posts} stores={stores} />
            </div>

            <div className="news-container" style={{ width: '58%', margin: '-22px auto 0 auto' }}>
              <h2>Новости</h2>
              <Carousel
                withIndicators
                height={500}
                slideSize="100%"
                slideGap={8}
                style={{ gap: '20px' }}
                loop
                align="center"
                slidesToScroll={1}
              >
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <Carousel.Slide className="carousel-container" key={`skeleton-${index}`}>
                        <div
                          style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px',
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Skeleton height={300} width="100%" radius="md" />
                          <Skeleton height={20} width="80%" mt="md" />
                          <Skeleton height={15} width="60%" mt="sm" />
                        </div>
                      </Carousel.Slide>
                    ))
                  : newsPerfumes.map((item) => (
                      <Carousel.Slide className="carousel-container" key={item._id}>
                        <CardCustom
                          image={item.coverImage}
                          title={item.title}
                          category={item.description} // Можно использовать другое значение, если нужно
                          id={item._id} // Передаем id для перехода
                        />
                      </Carousel.Slide>
                    ))}
              </Carousel>
              <Card
                mt="14"
                padding="xl"
                radius="18"
                bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}
                style={{
                  border: '4px solid transparent',
                  borderImageSlice: 1,
                  maxWidth: '100%', // Ограничение ширины
                  overflowX: 'auto', // Горизонтальная прокрутка
                }}
              >
                <Card.Section
                  padding="lg"
                  style={{
                    backgroundColor: theme.colors.default,
                    borderRadius: theme.radius.md,
                    padding: '20px',
                  }}
                >
                  <Group
                    spacing="md"
                    style={{
                      flexWrap: 'nowrap', // Запрет переноса элементов
                      justifyContent: 'left',
                      display: 'flex',
                      maxWidth: '100%', // Ограничение для Group
                      overflowX: 'auto', // Горизонтальная прокрутка для Group
                    }}
                  >
                    {popularBrands.map((brand, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingLeft: '6px',
                        }}
                      >
                        {brand.logo(isDark)}
                      </div>
                    ))}
                  </Group>
                </Card.Section>
              </Card>

              <div className="reviews-container-mobile">
                <RightMain posts={posts} firstBrand={firstBrand} perfumes={perfumes} />
              </div>
              <div className="posts-container-mobile">
                <LeftMain perfume={perfume} posts={posts} stores={stores} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '20px',
                  marginTop: '50px',
                }}
              >
                <h2 style={{ marginTop: '0px', fontSize: '22px', marginBottom: '50px' }}>
                  Новое в индустрии
                </h2>

                {/* Plus icon inside a circle */}
                <ActionIcon variant="outline" radius="xl" size="lg">
                  <IconPlus size={16} />
                </ActionIcon>
              </div>
              <div className="perfume-container">
                {latestNews.map((perfume) => (
                  <div
                    className="perfume-item"
                    onClick={() => (window.location.href = `/new/${perfume._id}`)}
                    key={perfume._id}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card padding="lg" radius="18">
                      {/* Image Section */}
                      <LazyLoad
                        height={180} // Высота контейнера для lazy loading
                        offset={100} // Начинает загрузку за 100px до видимости
                        placeholder={<Skeleton height={180} />} // Плейсхолдер
                      >
                        <Image
                          radius="14"
                          src={`https://hltback.parfumetrika.ru${perfume.coverImage}`} // Используем поле coverImage из newsPerfumes
                          alt={perfume.title}
                          height={180}
                          fit="contain"
                        />
                      </LazyLoad>

                      {/* Perfume Info */}
                      <Group position="apart" mt="md" mb="xs">
                        <div>
                          <Text mt="4" style={{ color: theme.colors.gray[6], fontSize: '12px' }}>
                            Новинки
                          </Text>
                          <Text mt="6" style={{ fontWeight: '900' }}>
                            {perfume.title} {/* Используем поле title */}
                          </Text>
                          <Text
                            size="xs"
                            mt="8"
                            style={{ color: theme.colors.gray[6], fontSize: '13px' }}
                          >
                            {perfume.description} {/* Используем поле description */}
                          </Text>
                        </div>
                        {perfume.isExclusive && (
                          <Badge color="yellow" variant="light">
                            Эксклюзивно
                          </Badge>
                        )}
                      </Group>

                      {/* Footer with Interactions */}
                      <Group mt="md" position="apart">
                        <Group spacing={5}>
                          <ActionIcon size="lg" radius="xl" variant="light">
                            <IconMessageCircle size={16} color={theme.colors.gray[6]} />
                          </ActionIcon>
                          <Text size="xs">{perfume.comments?.length || 0}</Text>{' '}
                          {/* Используем поле comments */}
                        </Group>
                      </Group>
                    </Card>
                  </div>
                ))}
              </div>

              <div style={{ width: '100%', marginTop: '50px' }} className="mob-hidden">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '20px',
                  }}
                >
                  <h2 style={{ marginTop: '0px', fontSize: '22px', marginBottom: '50px' }}>
                    Статьи от пользователей
                  </h2>

                  {/* Plus icon inside a circle */}
                  <ActionIcon
                    onClick={() => router.push(`/articles`)}
                    variant="outline"
                    radius="xl"
                    size="lg"
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </div>

                <div className="perfume-container" style={{ margin: '0 auto' }}>
                  {latestArticles.map((perfume) => (
                    <div
                      className="perfume-item"
                      key={perfume._id}
                      onClick={() => (window.location.href = `/article/${perfume._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card padding="lg" radius="18">
                        {/* Image Section */}
                        <LazyLoad
                          height={100} // Высота контейнера для lazy loading
                          offset={100} // Начинает загрузку за 100px до видимости
                          placeholder={<Skeleton height={100} />} // Плейсхолдер для загрузки
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100px',
                              overflow: 'hidden',
                              borderRadius: '14px',
                            }}
                          >
                            <Image
                              src={getImageSource(perfume.coverImage)}
                              alt={perfume.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        </LazyLoad>

                        {/* Perfume Info */}
                        <Group position="apart" mt="md" mb="xs">
                          <div style={{ height: '100px', overflow: 'hidden' }}>
                            <Text mt="4" style={{ color: theme.colors.gray[6], fontSize: '12px' }}>
                              Новинки
                            </Text>
                            <Text mt="6" style={{ fontWeight: '900' }}>
                              {perfume.title}
                            </Text>
                          </div>
                          {perfume.isExclusive && (
                            <Badge color="yellow" variant="light">
                              Эксклюзивно
                            </Badge>
                          )}
                        </Group>

                        {/* Footer with Interactions */}
                        <Group mt="md" position="apart">
                          <Group spacing={5}>
                            <ActionIcon size="lg" radius="xl" variant="light">
                              <IconMessageCircle size={16} color={theme.colors.gray[6]} />
                            </ActionIcon>
                            <Text size="xs">{perfume.comments?.length || 0}</Text>
                          </Group>
                        </Group>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="reviews-container">
              <RightMain posts={posts} firstBrand={firstBrand} perfumes={perfumes} />
            </div>
          </div>

          <Group
            style={{
              marginTop: '60px',
              marginBottom: '50px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <IconEye size={24} color={theme.colors.blue[6]} /> {/* Icon */}
            <Title style={{ fontSize: '22px', textAlign: 'center' }}>Сегодня просматривали</Title>
          </Group>

          {/* Условный рендеринг карусели или сообщения */}
          {recentlyViewedPerfumes.length > 0 ? (
            <Carousel
              slideSize="10%"
              align="start"
              slideGap="0"
              classNames={classes}
              loop
              slidesToScroll={1}
              style={{ marginTop: '20px', marginBottom: '40px' }}
            >
              {recentlyViewedPerfumes.map((perfume) => (
                <Carousel.Slide key={perfume.id}>
                  <Link href={`/perfumes/${perfume.id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      padding="sm"
                      radius="md"
                      shadow="0"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',

                        minWidth: '140px',
                      }}
                    >
                      <Image
                        src={`https://parfumetrika.ru/${perfume.image}`}
                        alt={perfume.name}
                        width={50}
                        style={{ maxWidth: '60px' }}
                        height={50}
                        fit="contain"
                        radius="md"
                      />
                      <div style={{ flex: 1 }}>
                        <Text mt="6" size="sm" style={{ textAlign: 'center' }} color="dimmed">
                          {perfume.brand}
                        </Text>
                        <Text
                          mt="4"
                          size="sm"
                          style={{ textAlign: 'center' }}
                          lineClamp={1}
                          color={theme.colors.blue[7]}
                        >
                          {perfume.name}
                        </Text>
                      </div>
                    </Card>
                  </Link>
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Text align="center" color="dimmed" mt="xl" size="md">
              Вы пока не просматривали
            </Text>
          )}
        </div>
      </div>
      <FooterLinks />
    </>
  );
}
