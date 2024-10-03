import { Carousel } from '@mantine/carousel';
import { Text, Container, ActionIcon, Group, rem, Card, Title, Avatar, Divider, Button, Rating, useMantineTheme, useMantineColorScheme, Image } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconCrown, IconCalendar, IconStar, IconPlus, IconMessageCircle, IconHeart, IconShoppingBag, IconMapPin, IconLeaf, IconUser, IconUserFilled, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';



export function RightMain({firstBrand,posts,notes,perfumes}) {

    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const { colorScheme } = useMantineColorScheme(); // Get color scheme
    const isDark = colorScheme === 'dark'; // Check if the theme is dar
  return (
   <>

        
        <Group align="center" style={{ marginBottom: '20px', gap: '10px' }}>
            <ActionIcon   
    radius="xl"
    size="lg" >
    <IconLeaf size={18} color={theme.colors.white} /> {/* Star icon */}
    </ActionIcon>
    <Title order={2} style={{ fontSize: '20px', margin: 0 }}>Нота дня</Title> {/* Title */}

    </Group>

    {/* Perfume Cards */}
    {notes.map((perfume) => (
    <Card key={perfume._id} className='card-notes' bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]} shadow="2" h='280px'  padding="lg" radius="18"  style={{ marginBottom: '20px' }}>
    <Group style={{ display: 'flex', alignItems: 'center', gap: '20px' ,flexDirection: 'column'}}>
    {/* Image Section */}
    <div style={{ flex: 1,textAlign: 'center' }} >
        <Text  size="lg" style={{ color: theme.colors.default}}>{perfume.title}</Text>

    </div>
    <div
        style={{
        height: 80,
        width: 80,
        borderRadius: '360px',
        backgroundColor: theme.colors.gray[0],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
        }}
    >
        <Image
        src='https://img.parfumo.de/notes/f1/f1_22c346156a3e3950b3e3b8769ca1877328dbce56_320.jpg' // Replace with the actual image
        alt={perfume.name}
        fit="contain"
        width="100%"
        radius='360'
        height="100%"
        />
    </div>
    <Text style={{textAlign: 'center',fontSize: '12px',width: '98%',color: theme.colors.gray[6]}}>Белая амбра лучшая амбра на свете богата аминокислотами </Text>
    <Button variant='outline' radius='12' style={{borderColor: theme.colors.gray[4],  color: isDark ? 'white' : 'black', }}>
    Читать полностью
    </Button>


    </Group>
    </Card>
    ))}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        {/* User icon inside a circle */}
        <ActionIcon

            color="blue"      // Change to any color you prefer
            radius="xl"
            size="lg"         
        >
            <IconUser size={16} color="white" />
        </ActionIcon>

        {/* Text starts aligned with icons */}
        <h2 style={{ marginTop: '-4px',fontSize: '22px' }}>Лучшее в блогах</h2>

        {/* Plus icon inside a circle */}
        <ActionIcon
            variant="outline"
            radius="xl"
            size="lg"
        >
            <IconPlus  color={theme.colors.blue[6]}  size={16} />
        </ActionIcon>
        </div>
        {posts.map((post, index) => (
    <div key={post.id}>
    <div style={{ marginBottom: '10px', width: '100%', display: 'flex', alignItems: 'center', gap: '14px' }}>
    <div>
    <Avatar src='https://pimages.parfumo.de/240/280762_img-6863-tom-ford-amber-intrigue_240.webp' alt={post.author} radius="8" size="lg" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0' }}>
    <IconUserFilled color={theme.colors.blue[6]} size={16} />
    <Text size="sm"  style={{ margin: 0, padding: 0 }}>{post.author}</Text>
    <Text size="xs" color="dimmed" style={{ margin: 0, padding: 0 }}>сегодня</Text>
    </div>
    <div style={{ marginTop: '8px' }}>
    <Text size="sm" style={{ margin: 0, padding: 0, width: '160px' }}>{post.title}</Text>
    </div>
    </div>
    </div>

    {/* Full-width Divider */}
    {index < posts.length - 1 && ( // Avoid rendering Divider after the last item
    <Divider size="1" my="lg" />
    )}
    </div>
    ))}
    <Button radius='12' variant='outline' mt='20'>Показать еще</Button>
    <Card mt='30' bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}  padding="xl" radius="18"  style={{ textAlign: 'center', maxWidth: '300px',width: '100%', margin: '0 auto' }}>
    {/* Title */}
    <Text size="xs" >Бренд дня</Text>
    <Text size="xl"  style={{ marginBottom: '10px' }}>Acqua dell Elba</Text>

    {/* Brand Logo */}



    <div
    style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
    }}
    >
    {firstBrand.logo(isDark)} {/* Display the logo of the first brand */}
    </div>

    {/* Carousel of Perfumes */}
    <Text size="sm" color="dimmed">Ароматы Acqua dell Elba</Text>
    <Carousel

    loop
    nextControlIcon={<IconChevronRight size={16} />}
    previousControlIcon={<IconChevronLeft size={16} />}
    style={{ marginTop: '10px', marginBottom: '20px' }}
    >
    {perfumes.map((perfume) => (
    <Carousel.Slide key={perfume.id}>
        <Image
        src={perfume.image}
        alt={perfume.name}
        width={50}
        height={80}
        fit="contain"
        style={{ marginBottom: '10px' }}
        />
        <Text weight={500}>{perfume.name}</Text>
        <Text size="sm" color="dimmed">{perfume.type}</Text>
    </Carousel.Slide>
    ))}
    </Carousel>

    {/* More Information Button */}
    <Button variant="outline" radius="md" fullWidth style={{ marginTop: '20px' }}>
    Вся информация о бренде
    </Button>
    </Card>
        
   
            </>
  );
}