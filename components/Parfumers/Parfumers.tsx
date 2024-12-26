'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { TextInput, Button, Loader, Group, Title, Breadcrumbs, Anchor } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import styles from './Parfumers.module.css';

import { Header } from '../Header/Header';
import { slugify } from '@/utils/slugify'; // Импорт функции slugify
import $api from '../api/axiosInstance';
import SearchInput from '../ui/InputSearch/InputSearch';
import { NavigationButtons } from '../ui/NavigationButtons/NavigationButtons';

export function Parfumers() {
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [parfumers, setParfumers] = useState<Record<string, string[]>>({});
  const [filteredParfumers, setFilteredParfumers] = useState<string[]>([]);
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

  const fetchParfumersForLetter = async (letter: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await $api.get(`/parfumers/parfumers/${letter}`);
      const originalParfumers = response.data.map((parfumer: any) => parfumer.original); // Извлекаем оригинальные названия парфюмеров
      setParfumers((prevParfumers) => ({
        ...prevParfumers,
        [letter]: originalParfumers,
      }));
      setFilteredParfumers(originalParfumers);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch parfumers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParfumersForLetter(selectedLetter);
  }, [selectedLetter]);

  useEffect(() => {
    if (parfumers[selectedLetter]) {
      const filtered = parfumers[selectedLetter].filter((parfumer) =>
        parfumer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredParfumers(filtered);
    }
  }, [searchTerm, parfumers, selectedLetter]);

  const renderParfumers = () => {
    if (loading) return <Loader />;
    if (error) return <li>{error}</li>;
    if (filteredParfumers.length === 0) return <li>No parfumers found</li>;

    return filteredParfumers.map((parfumer, index) => {
      // Split the parfumer name into words and take the first two
      const parfumerDisplayName = parfumer.split(' ').slice(0, 2).join(' ');

      return (
        <li key={index} className={styles.brandItem}>
          {/* Use slug for URL and pass the full original name in state */}
          <Link href={`/parfumer/${slugify(parfumer)}`} passHref>
            <span className={styles.brandText}>{parfumerDisplayName}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Perfume Parfumers</title>
        <meta name="description" content="List of perfume parfumers from A to Z" />
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

            <span style={{ color: '#6c757d' }}>Парфюмеры</span>
          </Breadcrumbs>
          <NavigationButtons />

          <Title order={1} className={styles.title}>
            Парфюмеры
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
            <ul className={styles.brands}>{renderParfumers()}</ul>
          </div>
        </div>
      </main>
    </>
  );
}
