'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { TextInput, Button, Loader, Group, Title, Breadcrumbs, Anchor } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import styles from './Welcome.module.css';

import { Header } from '../Header/Header';
import { slugify } from '@/utils/slugify'; // Импорт функции slugify
import $api from '../api/axiosInstance';
import SearchInput from '../ui/InputSearch/InputSearch';
import { NavigationButtons } from '../ui/NavigationButtons/NavigationButtons';

export function Welcome() {
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [brands, setBrands] = useState<Record<string, string[]>>({});
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const allLetters = [
    '#',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const fetchBrandsForLetter = async (letter: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await $api.get(`/brands/initial/${letter}`);
      const originalBrands = response.data.map((brand: any) => brand.original); // Извлекаем оригинальные названия брендов
      setBrands((prevBrands) => ({
        ...prevBrands,
        [letter]: originalBrands,
      }));
      setFilteredBrands(originalBrands);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandsForLetter(selectedLetter);
  }, [selectedLetter]);

  useEffect(() => {
    if (brands[selectedLetter]) {
      const filtered = brands[selectedLetter].filter((brand) =>
        brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchTerm, brands, selectedLetter]);

  const renderBrands = () => {
    if (loading) return <Loader />;
    if (error) return <li>{error}</li>;
    if (filteredBrands.length === 0) return <li>No brands found</li>;

    return filteredBrands.map((brand, index) => (
      <li key={index} className={styles.brandItem}>
        {/* Используем slug для URL и передаем оригинальное название бренда в state */}
        <Link href={`/brand/${slugify(brand)}`} passHref>
          <span className={styles.brandText}>{brand}</span>
        </Link>
      </li>
    ));
  };

  return (
    <>
      <Head>
        <title>Perfume Brands</title>
        <meta name="description" content="List of perfume brands from A to Z" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumbs
            separator=">"
            style={{
              fontSize: '14px',
              color: '#555',
              width: '90%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
              Главная
            </Anchor>

            <span style={{ color: '#6c757d' }}>Бренды</span>
          </Breadcrumbs>
          <NavigationButtons />

          <Title order={1} className={styles.title}>
            Бренды
          </Title>
          <span className={styles.description}>Выберите букву</span>

          <Group className={styles.letters} spacing="xs">
            {allLetters.map((letter) => (
              <Button
                key={letter}
                onClick={() => {
                  setSelectedLetter(letter);
                  setSearchTerm('');
                }}
                variant="outline"
                size="xs"
                className={selectedLetter === letter ? styles.active : ''}
              >
                {letter}
              </Button>
            ))}
          </Group>

          <div className={styles.brandList}>
            <h2>{selectedLetter}</h2>
            <ul className={styles.brands}>{renderBrands()}</ul>
          </div>
        </div>
      </main>
    </>
  );
}
