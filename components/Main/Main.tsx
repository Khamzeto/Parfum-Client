'use client';

import { Carousel } from '@mantine/carousel';
import {  CardCustom } from '../ui/CardCarousel/Card';
import { Image, Text, Badge, Group, Button, Avatar, useMantineTheme,Card, Stack, Title, ActionIcon, Center, rem, useMantineColorScheme, Grid, Divider, Rating, SimpleGrid } from '@mantine/core';
import { IconAward, IconCalendar, IconChevronLeft, IconChevronRight, IconCrown, IconEye, IconHeart, IconLeaf, IconMapPin, IconMessageCircle, IconPlus, IconShare, IconShoppingBag, IconStar, IconThumbUp, IconUser, IconUserFilled } from '@tabler/icons-react';
import '@mantine/carousel/styles.css';
import { Header } from '../Header/Header';
import InputSearch from '../ui/InputSearch/InputSearch';
import './Main.css'; // Подключаем стили, если они есть в файле Main.css
import { useMediaQuery } from '@mantine/hooks';
import classes from '../ui/CardCarousel/Card.module.css'
import Link from 'next/link';
import { ArticleCardFooter } from '../ui/ArticleCardFooter/ArticleCardFooter';
import { FooterLinks } from '../ui/Footer/Footer';

import { RightMain } from '../ui/RightMain/RightMain';
import { LeftMain } from '../ui/LeftMain/LeftMain';

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

const notes = [
    {
      id: 1,
      title: 'Апельсин',

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
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
  {
    id: 1,
    title: 'Мой любимый аромат на каждый день',
    author: 'John Doe',
    image: 'https://img.parfumo.de/blog_teaser/1d/1d_ce7339633bf681609827b2224277c2cfb0167ad1_1000.webp',
    description: 'Я использую этот аромат уже год и не могу нарадоваться.',
  },
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


const perfume = [
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
      brand: 'Chanel',
    },
    
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
      brand: 'Chanel',
    },
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
      brand: 'Chanel',
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
      brand: 'Chanel',
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
        brand: 'Chanel',
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
        brand: 'Chanel',
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
        brand: 'Chanel',
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
        brand: 'Chanel',
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
  const firstBrand = popularBrands[0]; 


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
        <h2 style={{ marginTop: '0px',marginBottom: '30px' }}>Последние парфюмы</h2>
        <Carousel
            slideSize="10%"
            align="start"
            slideGap="0"
            classNames={classes}
            loop     
            slidesToScroll={1}
            style={{ marginTop: '20px',marginBottom: '40px' }}
          >
            {perfumes.map((perfume) => (
              <Carousel.Slide key={perfume._id}>
                <Link href={`/perfumes/${perfume.perfume_id}`} style={{ textDecoration: 'none' }}>
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
                        src='https://pimages.parfumo.de/240/196014_img-1075-mellifluence-perfume-ericius_240.webp'
                        alt={perfume.name}
                        fit="contain"
                        width="30px"
                      />
                    </div>
                    <div style={{}}>
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
                    <Text
                      weight={500}
                      w="200px"
                 
                      align="left"
                      size="xs"
                    
                    >
                      {perfume.name}
                    </Text>
                    </div>
               
              
              
                  </div>
                </Link>
              </Carousel.Slide>
            ))}
          </Carousel>
          
          {/* News Section */}
          <div style={{ display: 'flex', maxWidth: '1440px', gap: '2%', alignItems: 'flex-start',paddingLeft: '20px',paddingRight: '20px',justifyContent: 'center' }}>
          <div className="posts-container">
            <LeftMain perfume={perfume} posts={posts} stores={stores}/>
            </div>
       
      <div className='news-container' style={{ width: '58%', margin: '-22px auto 0 auto' }}>
            <h2>Новости</h2>
            <Carousel
              withIndicators
              height={500}
              slideSize="100%" // Ensure it's full-width
              slideGap={8} // Adjust for better spacing
              style={{ gap: '20px' }}
              loop
              align={mobile ? 'center' : 'start'}
              slidesToScroll={1}
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
            <Card mt='14'  padding="xl" radius="18"  bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}  style={{

border: '4px solid transparent', // Initial border setting

borderImageSlice: 1, // Ensure the border is stretched properly
}}>


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

<div className="reviews-container-mobile">
     
     <RightMain notes={notes} posts={posts} firstBrand={firstBrand} perfumes={perfumes}/>
    </div>
    <div className="posts-container-mobile">
            <LeftMain perfume={perfume} posts={posts} stores={stores}/>
            </div>
          
<div style={{ display: 'flex',justifyContent: 'center',alignItems: 'flex-start', gap: '20px',marginTop: '50px'  }}>
 
          
          
 <h2 style={{ marginTop: '0px',fontSize: '22px',marginBottom: '50px' }}>Новое в индустрии</h2>



 {/* Plus icon inside a circle */}
 <ActionIcon
   variant="outline"
   radius="xl"
   size="lg"
 >
   <IconPlus size={16} />
 </ActionIcon>
</div>
<div className='perfume-container' >
    
    {perfumes.map((perfume) => (
      <div className='perfume-item' key={perfume.id} span={4}>
        <Card  padding="lg" radius="18" >
          {/* Image Section */}
          <Card.Section >
            <Image radius='50' src={perfume.image} alt={perfume.name} height={180} fit="contain" />
          </Card.Section>

          {/* Perfume Info */}
          <Group position="apart" mt="md" mb="xs">
            <div>
            <Text mt='4' style={{color: theme.colors.gray[6],fontSize: '12px'}}>Новинки</Text>
              <Text mt='6'  style={{fontWeight: '900'}}>{perfume.name}</Text>
              <Text size="xs"  mt='8'style={{color: theme.colors.gray[6],fontSize: '13px'}} >Эксклюзивная коллекция компании Chanel Эксклюзивная коллекция компании Chanel Эксклюзивная коллекция компании Chanel Эксклюзивная коллекция компании Chanel</Text>
            </div>
            {perfume.isExclusive && (
              <Badge color="yellow" variant="light">
                Эксклюзивно
              </Badge>
            )}
          </Group>

          <Text size="sm" color="dimmed">{perfume.description}</Text>

          {/* Footer with Interactions */}
          <Group mt="md" position="apart">
            <Group spacing={5}>
              <ActionIcon size="lg" radius="xl" variant="light">
                <IconHeart size={16} color={theme.colors.red[6]} />
              </ActionIcon>
              <Text size="xs">{perfume.likes}</Text>
            </Group>
            <Group spacing={5}>
              <ActionIcon size="lg" radius="xl" variant="light">
                <IconMessageCircle size={16} color={theme.colors.gray[6]} />
              </ActionIcon>
              <Text size="xs">{perfume.comments}</Text>
            </Group>
          </Group>
        </Card>
 
      </div>
    ))}
    
  </div>
 
  <div style={{width: '100%',marginTop: '50px'}}>
      <div style={{ display: 'flex',justifyContent: 'center',alignItems: 'flex-start', gap: '20px'  }}>
 
          
          
 <h2 style={{ marginTop: '0px',fontSize: '22px',marginBottom: '50px' }}>Статьи от пользователей</h2>



 {/* Plus icon inside a circle */}
 <ActionIcon
   variant="outline"
   radius="xl"
   size="lg"
 >
   <IconPlus size={16} />
 </ActionIcon>
</div>
    
      <div className='perfume-container' style={{margin: '0 auto'}}>
    
        {perfumes.map((perfume) => (
          <div className='perfume-item' key={perfume.id} span={4}>
            <Card  padding="lg" radius="18" >
              {/* Image Section */}
              <Card.Section >
                <Image radius='50' src={perfume.image} alt={perfume.name} height={180} fit="contain" />
              </Card.Section>

              {/* Perfume Info */}
              <Group position="apart" mt="md" mb="xs">
                <div>
                <Text mt='4' style={{color: theme.colors.gray[6],fontSize: '12px'}}>События</Text>
                  <Text mt='6'  style={{fontWeight: '900'}}>{perfume.name}</Text>
                  <Text size="xs"  mt='8'style={{color: theme.colors.gray[6],fontSize: '13px'}} >Эксклюзивная коллекция компании Chanel Эксклюзивная коллекция компании Chanel Эксклюзивная коллекция компании Chanel Эксклюзивная коллекция компании Chanel</Text>
                </div>
                {perfume.isExclusive && (
                  <Badge color="yellow" variant="light">
                    Эксклюзивно
                  </Badge>
                )}
              </Group>

              <Text size="sm" color="dimmed">{perfume.description}</Text>

              {/* Footer with Interactions */}
              <Group mt="md" position="apart">
                <Group spacing={5}>
                  <ActionIcon size="lg" radius="xl" variant="light">
                    <IconHeart size={16} color={theme.colors.red[6]} />
                  </ActionIcon>
                  <Text size="xs">{perfume.likes}</Text>
                </Group>
                <Group spacing={5}>
                  <ActionIcon size="lg" radius="xl" variant="light">
                    <IconMessageCircle size={16} color={theme.colors.gray[6]} />
                  </ActionIcon>
                  <Text size="xs">{perfume.comments}</Text>
                </Group>
              </Group>
            </Card>
          </div>
        ))}
      </div>
      </div>
          </div>
          <div className="reviews-container">
     
         <RightMain notes={notes} posts={posts} firstBrand={firstBrand} perfumes={perfumes}/>
        </div>
          
        
          </div>
         


  
      <Group  style={{ marginTop: '60px', marginBottom: '50px',display: 'flex',justifyContent: 'center',gap: '8px' }}>
    <IconEye size={24} color={theme.colors.blue[6]} /> {/* Eye icon */}
    <Title style={{ fontSize: '22px', textAlign: 'center' }}>
      Сегодня просматривали
    </Title>
  </Group>
  <Divider pb='20'/>
      <Carousel
            slideSize="10%"
            align="start"
            slideGap="0"
            classNames={classes}
            loop     
            slidesToScroll={1}
            style={{ marginTop: '20px',marginBottom: '40px' }}
          >
            {perfumes.map((perfume) => (
              <Carousel.Slide key={perfume._id}>
                <Link href={`/perfumes/${perfume.perfume_id}`} style={{ textDecoration: 'none' }}>
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
                        src='https://pimages.parfumo.de/240/196014_img-1075-mellifluence-perfume-ericius_240.webp'
                        alt={perfume.name}
                        fit="contain"
                        width="30px"
                      />
                    </div>
                    <div style={{}}>
                    <Text
                      w="2px"
                      size="xs"
                      style={{
                  
                        color: theme.colors.gray[6],
                      }}
                    >
                      {perfume.brand}
                    </Text>
                    <Text
                      w="200px"
                 
                      align="left"
                      size="xs"
                    
                    >
                      {perfume.name}
                    </Text>
                    </div>
               
              
              
                  </div>
                </Link>
              </Carousel.Slide>
            ))}
          </Carousel>
          <Divider/>
        </div>
      </div>
      <FooterLinks/>
    </>
  );
}
