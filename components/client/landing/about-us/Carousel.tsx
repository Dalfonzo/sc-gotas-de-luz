import { Box, BoxProps } from '@chakra-ui/react'
import Slider, { Settings } from 'react-slick'

import ImageCard from './ImageCard'

const CardContainer = (props: BoxProps) => {
  return <Box display="flex" alignItems="center" justifyContent="center" px="8px" {...props} />
}
export interface ImageList {
  imgAlt: string
  imgSrc: string
}

export default function Carousel({
  settings,
  containerProps,
  imagesList,
}: {
  settings?: Settings
  containerProps?: BoxProps
  imagesList: ImageList[]
}) {
  const baseSettings: Settings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    centerMode: true,
    centerPadding: '50px',
    cssEase: 'linear',
    infinite: true,
    pauseOnDotsHover: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    slidesToScroll: 1,
    slidesToShow: 3,
    speed: 20000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <Box {...containerProps} my="2.5rem">
      <Slider {...baseSettings} {...settings}>
        {imagesList.map((image, i) => {
          return (
            <CardContainer key={i}>
              <ImageCard imgAlt={image.imgAlt} imgSrc={image.imgSrc} />
            </CardContainer>
          )
        })}
      </Slider>
    </Box>
  )
}
