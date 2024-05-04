# Text Splitter App

The Text Splitter App is a simple web application built using Next.js, Tailwind CSS, and TypeScript. It allows users to input large text blocks and automatically splits them into smaller chunks for easier handling. Each chunk is limited to 4000 characters, making it convenient for users who need to work with lengthy text data.

## Features

- Text Input: Users can paste or type text into the input field.
- Automatic Splitting: The application automatically splits the input text into chunks of 4000 characters each.
- Copy Functionality: Each chunk is accompanied by a copy button, allowing users to quickly copy the chunk's content to the clipboard.
- Responsive Design: The application is designed to work seamlessly across various devices and screen sizes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
