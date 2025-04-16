import type { BlogPost, User } from '~/types';

const authors: User[] = [
  {
    id: 1,
    name: 'spacing tech',
    email: 'spacing.tech@electron.com',
    avatar: '/images/testimonial-1.png'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Who avoids a pain that produces?',
    slug: 'who-avoids-a-pain-that-produces',
    excerpt: 'Lorem ipsum dolor sit amet consectetur. Nec sit enim tellus faucibus bibendum ullamcorper. Phasellus tristique aenean at lorem sed scelerisque.',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel nulla at orci dictum facilisis. Mauris vel nibh at odio malesuada pellentesque et vel arcu. Sed auctor mi id eros scelerisque, vel fringilla odio dapibus. Donec efficitur rhoncus elit, sit amet ultrices dolor feugiat id.</p>
      
      <p>Proin tristique ultricies justo, id faucibus risus. Cras feugiat tincidunt est, quis pulvinar nisi pellentesque eu. Curabitur a semper lacus. Nullam mattis aliquam dapibus. Duis ac risus ac elit sagittis porttitor.</p>
      
      <h2>Principais recursos dos smartphones modernos</h2>
      
      <ul>
        <li>Câmeras de alta resolução</li>
        <li>Processadores potentes</li>
        <li>Bateria de longa duração</li>
        <li>Displays de alta qualidade</li>
      </ul>
      
      <p>Aliquam pretium risus justo, vitae tincidunt neque pharetra in. Nam nec purus rutrum, pulvinar velit at, placerat arcu. Nullam sit amet turpis et ligula facilisis ornare. Quisque aliquet, urna at scelerisque porttitor, dolor velit commodo nulla, in facilisis eros neque at mi. Cras mollis tincidunt neque, eget iaculis diam mollis eu.</p>
    `,
    image: '/images/blog-1.jpg',
    author: authors[0],
    publishedAt: '2023-10-22T09:30:00Z',
    tags: ['smartphones', 'tecnologia', 'audio']
  },
  {
    id: 2,
    title: 'Who avoids a pain that produces?',
    slug: 'who-avoids-a-pain-that-produces',
    excerpt: 'Lorem ipsum dolor sit amet consectetur. Nec sit enim tellus faucibus bibendum ullamcorper. Phasellus tristique aenean at lorem sed scelerisque.',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel nulla at orci dictum facilisis. Mauris vel nibh at odio malesuada pellentesque et vel arcu. Sed auctor mi id eros scelerisque, vel fringilla odio dapibus. Donec efficitur rhoncus elit, sit amet ultrices dolor feugiat id.</p>
      
      <p>Proin tristique ultricies justo, id faucibus risus. Cras feugiat tincidunt est, quis pulvinar nisi pellentesque eu. Curabitur a semper lacus. Nullam mattis aliquam dapibus. Duis ac risus ac elit sagittis porttitor.</p>
      
      <h2>Principais recursos dos smartphones modernos</h2>
      
      <ul>
        <li>Câmeras de alta resolução</li>
        <li>Processadores potentes</li>
        <li>Bateria de longa duração</li>
        <li>Displays de alta qualidade</li>
      </ul>
      
      <p>Aliquam pretium risus justo, vitae tincidunt neque pharetra in. Nam nec purus rutrum, pulvinar velit at, placerat arcu. Nullam sit amet turpis et ligula facilisis ornare. Quisque aliquet, urna at scelerisque porttitor, dolor velit commodo nulla, in facilisis eros neque at mi. Cras mollis tincidunt neque, eget iaculis diam mollis eu.</p>
    `,
    image: '/images/blog-2.jpg',
    author: authors[0],
    publishedAt: '2023-10-22T09:30:00Z',
    tags: ['smartphones', 'tecnologia', 'audio']
  }
]; 