import {
    Card,
    Image,
    ActionIcon,
    Group,
    Text,
    Avatar,
    Badge,
    useMantineTheme,
    rem,
  } from '@mantine/core';
  import { IconHeart, IconBookmark, IconShare } from '@tabler/icons-react';
  import classes from './ArticleCardFooter.module.css';
  
  export function ArticleCardFooter({ image, title, author, avatar, timePosted, likes }) {
    const theme = useMantineTheme();
  
    return (
      <Card withBorder padding="lg" radius="md" className={classes.card}>
        <Card.Section mb="sm">
          <Image
            src={image}
            alt={title}
            height={180}
          />
        </Card.Section>
  
        <Badge w="fit-content" variant="light">
          decorations {/* You can modify this or make it dynamic */}
        </Badge>
  
        <Text fw={700} className={classes.title} mt="xs">
          {title}
        </Text>
  
        <Group mt="lg">
          <Avatar
            src={avatar}
            radius="sm"
          />
          <div>
            <Text fw={500}>{author}</Text>
            <Text fz="xs" c="dimmed">
              {timePosted}
            </Text>
          </div>
        </Group>
  
        <Card.Section className={classes.footer}>
          <Group justify="space-between">
            <Text fz="xs" c="dimmed">
              {likes} people liked this
            </Text>
            <Group gap={0}>
              <ActionIcon variant="subtle" color="gray">
                <IconHeart
                  style={{ width: rem(20), height: rem(20) }}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <IconBookmark
                  style={{ width: rem(20), height: rem(20) }}
                  color={theme.colors.yellow[6]}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <IconShare
                  style={{ width: rem(20), height: rem(20) }}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          </Group>
        </Card.Section>
      </Card>
    );
  }
  