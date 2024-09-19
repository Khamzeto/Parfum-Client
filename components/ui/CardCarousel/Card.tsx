'use client'
import { Paper, Text, Title, Button } from '@mantine/core';
import classes from './Card.module.css';

interface CardProps {
  image: string;
  title: string;
  category: string;
}

export function CardCustom({ image, title, category }: CardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="15"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.cardCategory} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.cardTitle}>
          {title}
        </Title>
      </div>
      <Button variant="white" color="dark" className={classes.cardButton}>
        Read article
      </Button>
    </Paper>
  );
}
