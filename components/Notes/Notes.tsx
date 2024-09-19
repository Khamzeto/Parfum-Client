'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link'; // Импортируем Link
import { Button, Loader, Group, Title,Breadcrumbs,Anchor } from '@mantine/core';
import styles from './Notes.module.css';

import { Header } from '../Header/Header';
import $api from '../api/axiosInstance';
import SearchInput from '../ui/InputSearch/InputSearch';
import { NavigationButtons } from '../ui/NavigationButtons/NavigationButtons';

export function Notes() {
  const [selectedLetter, setSelectedLetter] = useState<string>('А');
  const [notes, setNotes] = useState<Record<string, { name: string; _id: string }[]>>({});
  const [filteredNotes, setFilteredNotes] = useState<{ name: string; _id: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const allLetters = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я'
  ];

  const fetchNotesForLetter = async (letter: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await $api.get(`/notes/initial/${letter}`);
      const originalNotes = response.data.map((note: any) => ({ name: note.name, _id: note._id })); // Извлекаем названия и id нот
      setNotes((prevNotes) => ({
        ...prevNotes,
        [letter]: originalNotes,
      }));
      setFilteredNotes(originalNotes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось получить ноты');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesForLetter(selectedLetter);
  }, [selectedLetter]);

  useEffect(() => {
    if (notes[selectedLetter]) {
      const filtered = notes[selectedLetter].filter((note) =>
        note.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes, selectedLetter]);

  const renderNotes = () => {
    if (loading) return <Loader />;
    if (error) return <li>{error}</li>;
    if (filteredNotes.length === 0) return <li>Ноты не найдены</li>;

    return filteredNotes.map((note, index) => (
      <li key={note._id} className={styles.noteItem}>
        {/* Используем Link для перехода на страницу с нотой */}
        <Link href={`/note/${note._id}`} passHref>
          <span className={styles.noteText}>{note.name}</span>
        </Link>
      </li>
    ));
  };

  return (
    <>
      <Head>
        <title>Perfume Notes</title>
        <meta name="description" content="List of perfume notes by letter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <SearchInput />
      <main className={styles.main}>
        <div className={styles.container}>
        <Breadcrumbs separator=">" style={{ fontSize: '14px', color: '#555', marginTop: '0px',marginBottom: '10px' }}>
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Anchor>
     
    
          <span style={{ color: '#6c757d' }}>Ноты</span>
        </Breadcrumbs>
        <NavigationButtons/>

          <Title order={1} className={styles.title}>Ноты</Title>
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

          <div className={styles.noteList}>
            <h2>{selectedLetter}</h2>
            <ul className={styles.notes}>
              {renderNotes()}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
