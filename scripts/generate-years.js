const fs = require('fs')
const path = require('path')

const base = 'https://picsum.photos/seed'

const years = [
  { year: 2006, title: 'The Beginning', summary: 'We said “I do” beneath a summer sky, surrounded by family and the quiet certainty that we had found our way home. Our first dance lasted just long enough to forget the world.', milestones: ['Wedding day', 'Honeymoon road trip', 'First set of keys'] },
  { year: 2007, title: 'First Home', summary: 'A tiny apartment with creaky floors became the first place we called ours. We learned to cook together, fought over paint colors, and stayed up too late talking on the fire escape.', milestones: ['Moved into first apartment', 'Adopted a houseplant', 'First Thanksgiving as hosts'] },
  { year: 2008, title: 'Road Trip West', summary: 'With a map and a cooler, we drove toward the coast. We slept under stars, argued over playlists, and realized that the best memories are often unplanned.', milestones: ['Cross-country road trip', 'First national park visit', 'Sunset at the Pacific'] },
  { year: 2009, title: 'Career Changes', summary: 'New jobs brought new pressures, late nights, and stretched schedules. We learned to be each other’s sounding board and safe harbor at the end of long days.', milestones: ['First promotion', 'Started a side project', 'Learned to rest together'] },
  { year: 2010, title: 'A New Arrival', summary: 'The world got bigger and louder in the best way. Sleepless nights gave way to first smiles, tiny fingers, and the humbling realization that love had multiplied.', milestones: ['Welcome first child', 'First family portrait', 'Moved to a bigger place'] },
  { year: 2011, title: 'Toddler Chaos', summary: 'Chaos reigned: scattered toys, impromptu concerts, and pure wonder. We learned patience by the minute and discovered joy in the smallest victories.', milestones: ['First steps', 'First words', 'First family vacation'] },
  { year: 2012, title: 'Building Dreams', summary: 'We traded weekend spontaneity for saving, planning, and building something lasting. It was tedious and beautiful, the quiet architecture of a shared future.', milestones: ['Started college fund', 'Began home search', 'Celebrated five years'] },
  { year: 2013, title: 'Family Adventures', summary: 'The three of us packed into the car and drove to the shore. Sandcastles, boardwalks, and sticky fingers became the language of our new rhythm.', milestones: ['Beach vacation', 'First amusement park visit', 'Built a sandbox in the yard'] },
  { year: 2014, title: 'Loss and Love', summary: 'We said goodbye to someone we loved too soon. Grief sat with us at the kitchen table, but so did grace, and we learned to hold each other a little tighter.', milestones: ['Honored a loved one', 'Created new rituals', 'Learned to grieve together'] },
  { year: 2015, title: 'Moving Forward', summary: 'A new home, a garden, and a mailbox with our name on it. We made a backyard for barbecues, fireflies, and the slow business of growing roots.', milestones: ['Bought a house', 'Planted a garden', 'First backyard party'] },
  { year: 2016, title: 'Milestone Birthday', summary: 'Forty looked good on us. Surrounded by friends, we laughed about the years behind us and raised a glass to the ones still ahead.', milestones: ['Surprise party', 'Renewed a dream', 'Weekend getaway'] },
  { year: 2017, title: 'New Horizons', summary: 'Passports stamped, trains caught, and ancient streets wandered. We ate bread in tiny cafés and remembered that the world was still wide open.', milestones: ['Trip to Europe', 'First overseas family flight', 'Collected too many postcards'] },
  { year: 2018, title: 'The Teen Years', summary: 'School projects, sports games, and the quiet ache of watching someone grow up. We found ourselves in the passenger seat of someone else’s becoming.', milestones: ['First school dance', 'Learned to drive', 'Family game night tradition'] },
  { year: 2019, title: 'Side by Side', summary: 'Career milestones arrived, and we celebrated them together. Victories felt sweeter when shared, and setbacks felt lighter when halved.', milestones: ['Major career milestone', 'Paid off a debt', 'Revisited our wedding song'] },
  { year: 2020, title: 'A Year Apart and Together', summary: 'The world closed its doors, but our home opened in new ways. Board games, bread baking, and long walks became the scaffolding of resilience.', milestones: ['Learned to work from home', 'Took up baking', 'Wrote letters to friends'] },
  { year: 2021, title: 'New Puppy', summary: 'A bundle of chaos with paws arrived. Early mornings, chewed slippers, and unconditional joy reminded us how good it is to welcome new love.', milestones: ['Adopted a dog', 'Named her together', 'First family hike with puppy'] },
  { year: 2022, title: 'Empty Nests and Full Hearts', summary: 'The house grew quieter, but the silence held new conversations. We rediscovered date nights, lazy mornings, and the version of us that started it all.', milestones: ['First child left for college', 'Rediscovered date nights', 'Took a cooking class'] },
  { year: 2023, title: 'Vow Renewal', summary: 'In the backyard, surrounded by those who matter most, we said the words again. They meant more the second time, worn soft by the years.', milestones: ['Vow renewal ceremony', 'Planted an anniversary tree', 'Hosted old friends'] },
  { year: 2024, title: 'Grand Adventures', summary: 'We chased sunrises across temples, markets, and unfamiliar cities. Travel reminded us that curiosity is a habit that keeps a marriage young.', milestones: ['Asia trip', 'Temple sunrise', 'Learned new dishes'] },
  { year: 2025, title: 'Slowing Down', summary: 'We said no to more things and yes to quiet. Books, long walks, and simple meals became the luxury we had earned.', milestones: ['Read more books', 'Started morning walks', 'Simplified the calendar'] },
  { year: 2026, title: 'Twenty Years', summary: 'Two decades of choosing each other, day after day. We gather the memories, the hard and the golden, and look ahead with gratitude.', milestones: ['Twentieth anniversary', 'Renewed goals', 'Dreamed up the next chapter'] },
]

const data = years.map((y) => ({
  ...y,
  heroImage: `${base}/${y.year}/1920/1080`,
  galleryImages: [
    `${base}/${y.year}-g1/800/600`,
    `${base}/${y.year}-g2/800/600`,
    `${base}/${y.year}-g3/800/600`,
  ],
}))

const outDir = path.join(__dirname, '..', 'src', 'data')
const outFile = path.join(outDir, 'years.json')

try {
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2))
} catch (error) {
  console.error(`Failed to write ${outFile}:`, error)
  process.exit(1)
}

console.log('Generated src/data/years.json')
