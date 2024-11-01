'use client';
import { Header } from '@/components/Header/Header';
import { FaqSimple } from '@/components/ui/FaqSimple/Faq';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Container, Text, Title, Card, Group, Button, Stack } from '@mantine/core';

export default function AboutUs() {
  return (
    <>
      <head>
        <title>FAQ | Parfumetrika</title>
        <meta name="description" content="Ответы на вопросы,Parfumetrika" />
      </head>
      <Header />
      <Container mb="-140" mt="20" size="sm" style={{ padding: '40px 20px' }}>
        <FaqSimple />
      </Container>
      <FooterLinks />
    </>
  );
}
