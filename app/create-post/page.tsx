// pages/index.tsx
'use client';

import RichText from '@/components/ui/RichText/RichText';
import { Container, TextInput, Textarea, Card, Box, Text } from '@mantine/core';

export default function Home() {
  return (
    <Container fluid maw="1440px" style={{ margin: '20px auto 0 auto' }} mt="20">
      {/* Card wraps the content */}
      <Card shadow="sm" padding="lg" radius="16">
        <Box mb="lg">
          <Text size="lg" weight={500} mb="md">Создать Новую Статью</Text>

          {/* Title Input */}
          <TextInput
            label="Заголовок"
            placeholder="Введите заголовок"
            required
            mb="md"
          />

          {/* Description Textarea */}
          <Textarea
            label="Описание"
            placeholder="Введите описание статьи"
            required
            mb="md"
            minRows={3}
          />
        </Box>

        {/* Rich Text Editor */}
        <Text style={{fontSize: '14px',fontWeight: '500'}} mb="xs">Статья</Text>
        <RichText />
      </Card>
    </Container>
  );
}
