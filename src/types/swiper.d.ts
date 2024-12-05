declare module 'swiper/react' {
  import { ReactElement, Component } from 'react';
  import { SwiperOptions } from 'swiper';

  interface SwiperProps extends SwiperOptions {
    children: ReactElement[];
  }

  export class Swiper extends Component<SwiperProps> {}
  export class SwiperSlide extends Component<any> {}
}

declare module 'swiper/modules' {
  export const Autoplay: any;
  export const Pagination: any;
  export const Navigation: any;
}

declare module 'swiper/css';
declare module 'swiper/css/pagination';
declare module 'swiper/css/navigation'; 