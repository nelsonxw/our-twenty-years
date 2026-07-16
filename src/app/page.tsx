import { Hero } from '@/components/hero'
import { YearChapter } from '@/components/year-chapter'
import { ByTheNumbers } from '@/components/by-the-numbers'
import { Reflection } from '@/components/reflection'
import { Footer } from '@/components/footer'
import years from '@/data/years.json'
import { getReflection } from '@/lib/get-reflection'

export default async function Home() {
  const reflection = await getReflection()

  return (
    <main>
      <Hero />
      {years.map((year, index) => (
        <YearChapter key={year.year} data={year} index={index} />
      ))}
      <ByTheNumbers />
      <Reflection content={reflection} />
      <Footer />
    </main>
  )
}
