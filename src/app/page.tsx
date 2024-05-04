import { TextSplitter } from '@/components/TextSplitter'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col w-full p-24'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Text Splitter</h1>
      <TextSplitter />
    </main>
  )
}
