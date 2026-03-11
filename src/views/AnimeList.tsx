import { useQuery } from '@tanstack/react-query'
import { caller } from '../trpc/caller'
import type { AnimeSeason } from '../types/anilist'

function removeTags(html: string | null) {
  if (!html) return ''
  return html.replace(/(<([^>]+)>)/gi, '')
}

function timezone() {
  return /\((.*)\)/.exec(new Date().toString())?.[1] ?? ''
}

function airingStatus(nextAiringEpisode: { airingAt: number } | null) {
  if (!nextAiringEpisode) return 'Finished Airing'
  const time = new Date(nextAiringEpisode.airingAt * 1000)
  const mins = time.getMinutes()
  return `Airing on ${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear()} at ${time.getHours()}:${mins < 10 ? '0' + mins : mins} ${timezone()}`
}

function getCurrentSeason(): { season: AnimeSeason; year: number } {
  const m = new Date().getMonth()
  const year = new Date().getFullYear()
  const season: AnimeSeason = m <= 2 ? 'WINTER' : m <= 5 ? 'SPRING' : m <= 8 ? 'SUMMER' : 'FALL'
  return { season, year }
}

const cardClass = 'relative inline-grid text-center font-sans rounded-xl mx-6 mt-12 mb-6 w-[200px] border border-cyan-600'

export default function AnimeList() {
  const { season, year } = getCurrentSeason()

  const { data: seasonalAnime, isLoading: seasonLoading, isError: seasonError } = useQuery({
    queryKey: ['anime.getCurrentSeason', season, year],
    queryFn: () => caller.anime.getCurrentSeason({ season, year }),
  })

  const { data: myAnimeList, isLoading: myListLoading } = useQuery({
    queryKey: ['anime.getMyList'],
    queryFn: () => caller.anime.getMyList(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Anime List</h1>

      <h2 className="text-xl font-semibold mt-6">Current {season} Anime {year}</h2>
      <h4 className="text-sm text-gray-600">Source: anichart.net</h4>

      {seasonLoading && <p>Loading seasonal anime...</p>}
      {seasonError && <p>Could not load seasonal anime. Try reloading the page.</p>}

      <div className="inline-block text-center mx-[10vw] mb-[10vh]">
        {seasonalAnime?.map((show) => {
          const officialSite = show.externalLinks.find((l) => l.site === 'Official Site')
          return (
            <div key={show.title.native ?? show.title.romaji ?? ''} className={cardClass} style={{ backgroundColor: 'rgb(252,214,88)' }}>
              <a href={officialSite?.url ?? '#'} target="_blank" rel="noopener noreferrer">
                <img src={show.coverImage.extraLarge ?? ''} alt="Show Cover" className="block mx-auto mt-2 w-[185px] h-[265px]" />
              </a>
              <p className="text-sm mt-1">{show.title.romaji}</p>
              <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 active:opacity-100 overflow-y-auto bg-black/80 text-white transition-opacity duration-400 w-[200px]">
                <div className="p-2.5 text-xs inline-block text-center">{airingStatus(show.nextAiringEpisode)}</div>
                <div className="p-2.5 text-xs inline-block text-center">{removeTags(show.description)}</div>
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="text-xl font-semibold mt-6">My Anime List</h2>
      <h4 className="text-sm text-gray-600">Source: myanimelist.net</h4>

      {myListLoading && <p>Loading my anime list...</p>}

      <div className="inline-block text-center mx-[10vw] mb-[10vh]">
        {myAnimeList?.map((entry) => {
          const { node, list_status } = entry
          const eps = node.num_episodes === 0 ? '?' : node.num_episodes
          const statusStr = list_status.status === 'watching' ? 'Currently watching.'
            : list_status.status === 'completed' ? 'Completed.'
            : list_status.status === 'plan_to_watch' ? 'Plan to watch.'
            : 'Dropped.'
          return (
            <div key={node.id} className={cardClass} style={{ backgroundColor: node.color ?? '#F6FCFC' }}>
              <a href={`https://myanimelist.net/anime/${node.id}`} target="_blank" rel="noopener noreferrer">
                <img src={node.main_picture.large} alt="Show Cover" className="block mx-auto mt-2 w-[185px] h-[265px]" />
              </a>
              <p className="text-sm mt-1">{node.title}</p>
              <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 active:opacity-100 overflow-y-auto bg-black/80 text-white transition-opacity duration-400 w-[200px]">
                <div className="p-2.5 text-xs inline-block text-center">{statusStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">Watched: {list_status.num_episodes_watched}/{eps} Episodes</div>
                <div className="p-2.5 text-xs inline-block text-center">Score: {list_status.score}/10</div>
                <div className="p-2.5 text-xs inline-block text-center">
                  <a href={`https://myanimelist.net/anime/${node.id}`} className="text-white no-underline hover:text-cyan-400">MAL Link</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
