import React, { useState } from 'react';
import { Card, Image, Box, Loader, Title, Modal, Button, Group } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface Perfume {
  gallery_images: string[]; // Array of base64 images or image URLs
}

interface GallerySectionProps {
  perfume: Perfume | null; // Allow null until data is loaded
}

const GallerySection: React.FC<GallerySectionProps> = ({ perfume }) => {
  const [opened, setOpened] = useState(false); // State for modal visibility
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Track the current image index

  const handleImageClick = (index: number) => {
    setCurrentIndex(index); // Set the clicked image's index
    setOpened(true); // Open the modal
  };

  const handleNext = () => {
    if (perfume) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % perfume.gallery_images.length);
    }
  };

  const handlePrevious = () => {
    if (perfume) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + perfume.gallery_images.length) % perfume.gallery_images.length
      );
    }
  };

  if (!perfume) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '300px',
        }}
      >
        <Loader size="lg" />
      </Box>
    );
  }

  return (
    <>
      <Title order={2} size="24" mt="20" mb="10">
        Фотографии
      </Title>

      <Box
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'left',
        }}
      >
        {perfume.gallery_images.map((image, index) => (
          <Card
            key={index}
            padding="lg"
            radius="14"
            style={{
              flex: '1 1 calc(10% - 16px)',
              maxWidth: 'calc(10% - 16px)',
              minWidth: '100px',
            }}
            onClick={() => handleImageClick(index)} // Handle image click
          >
            <Card.Section>
              <Image
                src={image}
                height={100}
                alt={`Gallery Image ${index + 1}`}
                radius="md"
                style={{ objectFit: 'cover', cursor: 'pointer' }}
              />
            </Card.Section>
          </Card>
        ))}
      </Box>

      {/* Modal to show the selected image with navigation */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)} // Close modal handler
        size="auto"
        centered
        withCloseButton={false}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Previous Button */}
          <Button
            variant="subtle"
            onClick={handlePrevious}
            style={{
              position: 'absolute',
              left: '0px',
              zIndex: 10,
              height: '100%',

              borderRadius: 0,
            }}
            tabIndex={-2} // Remove from tab focus
            aria-hidden="true"
          >
            <IconChevronLeft size={32} />
          </Button>

          {/* Display the Current Image */}
          <Image
            src={perfume.gallery_images[currentIndex]}
            alt={`Gallery Image ${currentIndex + 1}`}
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />

          {/* Next Button */}
          <Button
            variant="subtle"
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: 0,
              zIndex: 10,
              height: '100%',
              borderRadius: 0,
            }}
            tabIndex={-1}
            aria-hidden="true"
          >
            <IconChevronRight size={32} />
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default GallerySection;
