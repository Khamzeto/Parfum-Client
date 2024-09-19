'use client';

import { Carousel } from '@mantine/carousel';
import {  CardCustom } from '../ui/CardCarousel/Card';
import { Image, Text, Badge, Group, Button, Avatar, useMantineTheme,Card, Stack, Title, ActionIcon, Center, rem, useMantineColorScheme } from '@mantine/core';
import { IconAward, IconCalendar, IconEye, IconHeart, IconMessageCircle, IconShare, IconStar, IconThumbUp } from '@tabler/icons-react';
import '@mantine/carousel/styles.css';
import { Header } from '../Header/Header';
import InputSearch from '../ui/InputSearch/InputSearch';
import './Main.css'; // Подключаем стили, если они есть в файле Main.css
import { useMediaQuery } from '@mantine/hooks';
import classes from '../ui/CardCarousel/Card.module.css'
import Link from 'next/link';
import { ArticleCardFooter } from '../ui/ArticleCardFooter/ArticleCardFooter';
import { FooterLinks } from '../ui/Footer/Footer';

const news = [
  {
    id: 1,
    title: 'Новинки сезона 2024',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Откройте для себя последние ароматы 2024 года.',
    category: 'Новость',
  },
  {
    id: 2,
    title: 'Лучшая парфюмерия для осени',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Подборка осенних ароматов для любого настроения.',
    category: 'Новость',
  },
  {
    id: 3,
    title: 'Лучшая парфюмерия для осени',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Подборка осенних ароматов для любого настроения.',
    category: 'Новость',
  },
  {
    id: 4,
    title: 'Лучшая парфюмерия для осени',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Подборка осенних ароматов для любого настроения.',
    category: 'Новость',
  },
  {
    id: 5,
    title: 'Лучшая парфюмерия для осени',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Подборка осенних ароматов для любого настроения.',
    category: 'Новость',
  },

];



const posts = [
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 2,
    title: 'Как выбрать парфюм?',
    author: 'Jane Smith',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Советы, которые помогут вам выбрать идеальный аромат.',
  },
  {
    id: 3,
    title: 'Как выбрать парфюм?',
    author: 'Jane Smith',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Советы, которые помогут вам выбрать идеальный аромат.',
  },
];

const reviews = [
    {
      id: 1,
      user: 'Kaleidoscent',
      avatar: 'https://pimages.parfumo.de/240/280867_img-8512-kilesa-body-modification_240.webp',
      time: '34 minutes ago',
      productName: 'Sulawesi - Nissaba',
      productImage: 'https://pimages.parfumo.de/240/280867_img-8512-kilesa-body-modification_240.webp',
      reviewText: 'Warm, woody, delicate opening and then... nothing. Sadly it has disappeared from the testing strip before I could smell the heart...',
      helpfulCount: 1,
    },
    {
      id: 2,
      user: 'AnotherReviewer',
      avatar: 'https://pimages.parfumo.de/240/280867_img-8512-kilesa-body-modification_240.webp',
      time: '1 hour ago',
      productName: 'Chanel No 5',
      productImage: 'https://pimages.parfumo.de/240/280867_img-8512-kilesa-body-modification_240.webp',
      reviewText: 'Classic fragrance, timeless, but not everyone’s cup of tea...Classic fragrance, timeless, but not everyone’s cup of tea...Classic fragrance, timeless, but not everyone’s cup of tea...Classic fragrance, timeless, but not everyone’s cup of tea...',
      helpfulCount: 5,
    },
  
    // Add more reviews here...
  ];

const latestPerfumes = [
  {
    id: 1,
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    image: 'https://example.com/bleu-de-chanel.jpg',
    description: 'Свежий, древесный и мужественный аромат.',
  },
  // Other perfumes...
];
const perfumes = [
    {
      _id: 1,
      perfume_id: 'bleu-de-chanel',
      name: 'Bleu de Chanel',
      image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
      type: 'Eau de Parfum',
      rating_value: 4.5,
      rating_count: 120,
      release_year: 2018,
      gender: 'male',
    },
    {
      _id: 2,
      perfume_id: 'la-vie-est-belle',
      name: 'La Vie Est Belle',
      image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
      type: 'Eau de Parfum',
      rating_value: 4.8,
      rating_count: 98,
      release_year: 2015,
      gender: 'female',
    },
    {
        _id: 3,
        perfume_id: 'la-vie-est-belle',
        name: 'La Vie Est Belle',
        image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
        type: 'Eau de Parfum',
        rating_value: 4.8,
        rating_count: 98,
        release_year: 2015,
        gender: 'female',
      },
      {
        _id: 4,
        perfume_id: 'la-vie-est-belle',
        name: 'La Vie Est Belle',
        image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
        type: 'Eau de Parfum',
        rating_value: 4.8,
        rating_count: 98,
        release_year: 2015,
        gender: 'female',
      },
      {
        _id: 4,
        perfume_id: 'la-vie-est-belle',
        name: 'La Vie Est Belle',
        image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
        type: 'Eau de Parfum',
        rating_value: 4.8,
        rating_count: 98,
        release_year: 2015,
        gender: 'female',
      },
      {
        _id: 4,
        perfume_id: 'la-vie-est-belle',
        name: 'La Vie Est Belle',
        image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
        type: 'Eau de Parfum',
        rating_value: 4.8,
        rating_count: 98,
        release_year: 2015,
        gender: 'female',
      },
      {
        _id: 4,
        perfume_id: 'la-vie-est-belle',
        name: 'La Vie Est Belle',
        image: 'https://pimages.parfumo.de/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette.jpg',
        type: 'Eau de Parfum',
        rating_value: 4.8,
        rating_count: 98,
        release_year: 2015,
        gender: 'female',
      },
    // Add more perfumes as needed...
  ];
  const popularBrands = [
    {
        name: 'Gucci',
        logo: (isDark: boolean) => (

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
              fill={isDark ? '#FFFFFF' : '#000000'}// Dynamically setting fill color based on theme
              d="M35,20a10.4,10.4,0,0,1-15,9.31,10.38,10.38,0,1,1,0-18.64A10.43,10.43,0,0,1,35,20Zm-2,0a8.35,8.35,0,0,0-8.34-8.34A8.24,8.24,0,0,0,22.1,12a10.26,10.26,0,0,1,3.32,5.17H23.28A8.31,8.31,0,0,0,20,13a8.29,8.29,0,0,0-3.25,4.18H14.61A10.48,10.48,0,0,1,17.94,12a8.67,8.67,0,0,0-2.53-.38,8.34,8.34,0,0,0,0,16.68,8.11,8.11,0,0,0,2.49-.38,10.23,10.23,0,0,1-3.63-7.12h4.94v2l-2.41,0a8.34,8.34,0,0,0,3.21,4,8.34,8.34,0,0,0,3.21-4l-2.41,0v-2h4.94a10.31,10.31,0,0,1-3.67,7.1,8.48,8.48,0,0,0,2.53.4A8.3,8.3,0,0,0,33,20Z"
            />
          </g>
        </svg>
        )
    },
    {
        name: 'Gucci',
        logo: (isDark) => (
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
        )
    },
    {
        name: 'Gucci',
        logo: (isDark) => (
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
        )
    },
    // Add more brands here...
  ];


export default function Main() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme } = useMantineColorScheme(); // Get color scheme
  const isDark = colorScheme === 'dark'; // Check if the theme is dark


  return (
    <>
      <Header />
      <InputSearch />
      <div className="main-container">
        <div className="main-content">
          {/* News Section */}
          <h2>Новости</h2>
          <div style={{ maxWidth: '1440px' }}>
            <Carousel
              withIndicators
              height={500}
              slideSize={{ base: '100%', sm: '33.33%' }}
              slideGap={{ base: 'xl', sm: 8 }}
              style={{ gap: '20px' }}
              loop
              align={mobile ? 'center' : 'start'}
              slidesToScroll={mobile ? 1 : 1}
            >
              {news.map((item) => (
                <Carousel.Slide className="carousel-container" key={item.id}>
                  <CardCustom
                    image={item.image}
                    title={item.title}
                    category={item.category}
                    description={item.description}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
          <h2>Посты</h2>
          {/* Posts Section */}
          <div className="posts-container">
        {posts.map((post) => (
          <ArticleCardFooter
            key={post.id}
            image={post.image}
            title={post.title}
            author={post.author}
            avatar={post.avatar}
            timePosted={post.timePosted}
            likes={post.likes}
          />
        ))}
      </div>
          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>Последние отзывы</h2>
            <Carousel
              slideSize="100%"
              height="auto"
              align="center"
              slideGap="8"
              loop
              withIndicators
              slidesToScroll={1}
              classNames={classes}
            >
              {reviews.map((review) => (
                <Carousel.Slide key={review.id}>
                  <Card padding="lg" radius="18" withBorder>
                    <Group position="apart">
                      <Group>
                        <Avatar src={review.avatar} alt={review.user} size="md" />
                        <div>
                          <Text weight={500}>{review.user}</Text>
                          <Text size="xs" color="dimmed">{review.time}</Text>
                        </div>
                      </Group>
                      <Group style={{ marginLeft: 'auto' }}>
                        <Avatar src={review.productImage} size="sm" />
                        <Text size="sm" color="dimmed">{review.productName}</Text>
                      </Group>
                    </Group>
                    <Text mt="md" mb="sm" style={{ lineHeight: 1.5, wordWrap: 'break-word', whiteSpace: 'normal' }}>
                      {review.reviewText}
                    </Text>
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>

          {/* Perfume Carousel */}
          <h2 style={{ marginTop: '40px' }}>Последние парфюмы</h2>
          <Carousel
            slideSize="25%"
            align="start"
            slideGap="8"
            loop     
            slidesToScroll={1}
            style={{ marginTop: '50px' }}
          >
            {perfumes.map((perfume) => (
              <Carousel.Slide key={perfume._id}>
                <Link href={`/perfumes/${perfume.perfume_id}`} style={{ textDecoration: 'none' }}>
                  <div
                    key={perfume._id}
                    style={{
                      minHeight: '220px',
                      maxWidth: '200px',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '160px',
                      marginBottom: '20px',
                      margin: '0 auto',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        height: 100,
                        minWidth: '80%',
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        maxWidth: '150px',
                      }}
                    >
                      <Image
                        src='https://pimages.parfumo.de/240/196014_img-1075-mellifluence-perfume-ericius_240.webp'
                        alt={perfume.name}
                        fit="contain"
                        width="60px"
                      />
                    </div>
                    <Text
                      weight={500}
                      w="180px"
                      mt="4px"
                      align="center"
                      size="xs"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        overflow: 'hidden',
                      }}
                    >
                      {perfume.name}
                    </Text>
                    {perfume.type && (
                      <Badge variant="light" mt="-2px" mb="2px" align="center">
                        {perfume.type}
                      </Badge>
                    )}
                    <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                      <Text size="xs" style={{ color: 'var(--mantine-color-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IconStar size={16} style={{ color: theme.colors.yellow[6] }} /> {perfume.rating_value} ({perfume.rating_count} отзывов)
                      </Text>
                    </Group>
                    <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                      <Text size="xs" style={{ color: 'var(--mantine-color-text)', display: 'flex', alignItems: 'center', gap: '4px' }} align="center">
                        <IconCalendar size={16} style={{ color: theme.colors.blue[6] }} /> {perfume.release_year}
                      </Text>
                    </Group>
                  </div>
                </Link>
              </Carousel.Slide>
            ))}
          </Carousel>
          <Card mt='60' padding="xl" radius="18" withBorder style={{ backgroundColor: theme.colors.default }}>
     

      <Card.Section
        padding="lg"
        style={{
          backgroundColor: theme.colors.default,
          borderRadius: theme.radius.md,
          padding: '20px',
        }}
      >
        <Group spacing="md" style={{ flexWrap: 'wrap', justifyContent: 'left' }}>
        {popularBrands.map((brand, index) => (
        
        <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {brand.logo(isDark)}
      </div>
  
          ))}
        </Group>
      </Card.Section>
    </Card>
        </div>
      </div>
      <FooterLinks/>
    </>
  );
}
