// components/ProfileCard.tsx
'use client'
import React, { useState } from 'react';
import { Avatar, Button, Grid, Group, Paper, Stack, Text, Title, Badge, Divider } from '@mantine/core';

const perfumes = [
  { name: '1992 Purple Nights', brand: 'Les Bains Guerbois', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
  { name: 'Solaris', brand: 'Penhaligon\'s', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
  { name: 'Hypnotic Poison', brand: 'Dior', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
  { name: 'Mixed Emotions', brand: 'Byredo', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
  { name: 'L\'eau Papier', brand: 'Diptyque', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
  { name: 'Eau des Merveilles', brand: 'Hermès', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
  { name: 'Carnal Flower', brand: 'Frédéric Malle', image: 'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp' },
];

// Галерея с загруженными изображениями
const galleryImages = [
  'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp',
  'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp',
  'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp',
  'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp',
  'https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp',
];

const ProfileCard = () => {
    const [selectedTab, setSelectedTab] = useState('Коллекция');
  
    return (
      <div style={{ display: 'flex', gap: '20px', paddingRight: '20px', paddingLeft: '20px', margin: '0 auto', maxWidth: '1500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1500px', padding: '80px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <Avatar size='200px' radius='12' />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Title>Khamzeto</Title>
              <Text mb='14' mt='14'>Eau des Merveilles Eau des Merveilles</Text>
              <Text mb='14' style={{ fontSize: '14px' }}>Eau des Merveilles Eau des Merveilles  Merveilles Eau des Merveilles  Merveilles Eau des Merveilles</Text>
              <Button w='28%' variant='outline' radius='12'>Редактировать</Button>
            </div>
          </div>
  
          <div style={{ display: 'flex', gap: '8px', marginTop: '30px' }}>
            {/* Кнопки */}
            {['Коллекция', 'Я хочу', 'Посты', 'Галерея'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                w='20%'
                variant={selectedTab === tab ? 'filled' : 'outline'}
                color='blue'
                style={{
                  borderRadius: '16px 16px 0 0',
                  position: 'relative',
                }}
              >
                {tab}
              </Button>
            ))}
          </div>
  
          {/* Отображение контента на основе выбранной вкладки */}
          {selectedTab === 'Коллекция' && (
            <div style={{ marginTop: '50px' }}>
              <Title order={4}>Любимые парфюмы</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '24px', marginTop: '20px' }}>
                {perfumes.map((perfume) => (
                  <div key={perfume.name} style={{ textAlign: 'center', padding: '0', margin: '0' }}>
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '4px' }}
                    />
                    <div style={{ margin: '0', padding: '0' }}>
                      <Text size="sm" weight={500} style={{ margin: '0', padding: '0' }}>{perfume.name}</Text>
                      <Text size="xs" color="dimmed" style={{ margin: '0', padding: '0' }}>{perfume.brand}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {selectedTab === 'Я хочу' && (
            <div style={{ marginTop: '50px' }}>
              <Title order={4}>Я хочу</Title>
              <Text>Контент для вкладки "У меня есть".</Text>
            </div>
          )}
  
          {selectedTab === 'Посты' && (
            <div style={{ marginTop: '50px' }}>
              <Title order={4}>Посты</Title>
              <Text>Контент для вкладки "Посты".</Text>
            </div>
          )}
  
          {selectedTab === 'Галерея' && (
            <div style={{ marginTop: '50px' }}>
              <Title order={4}>Галерея</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '24px', marginTop: '20px' }}>
                {galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '4px' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

export default ProfileCard;
