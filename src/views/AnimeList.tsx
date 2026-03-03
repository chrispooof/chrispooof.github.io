import { useQuery } from '@tanstack/react-query'
import { caller } from '../trpc/caller'
import type { AnimeSeason } from '../types/anilist'

function getLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function removeTags(html: string | null) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

function getCurrentSeason(): { season: AnimeSeason; year: number } {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  let season: AnimeSeason
  if (month <= 2) season = 'WINTER'
  else if (month <= 5) season = 'SPRING'
  else if (month <= 8) season = 'SUMMER'
  else season = 'FALL'
  return { season, year }
}

export default function AnimeList() {
  const { season, year } = getCurrentSeason()

  const {
    data: seasonalAnime,
    isLoading: seasonLoading,
    isError: seasonError,
  } = useQuery({
    queryKey: ['anime.getCurrentSeason', season, year],
    queryFn: () => caller.anime.getCurrentSeason({ season, year }),
  })

  const {
    data: myAnimeList,
    isLoading: myListLoading,
  } = useQuery({
    queryKey: ['anime.getMyList'],
    queryFn: () => caller.anime.getMyList(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Anime List</h1>

      <h2 className="text-xl font-semibold mt-6">
        Current {season} Anime {year}
      </h2>
      <h4 className="text-sm text-gray-600">Source: anilist.co</h4>

      {seasonLoading && <p>Loading seasonal anime...</p>}
      {seasonError && <p>Could not load seasonal anime. Try reloading the page.</p>}

      <div className="inline-block text-center mx-[10vw] mb-[10vh]">
        {seasonalAnime?.map((show) => {
          const airingAt = show.nextAiringEpisode
            ? new Date(show.nextAiringEpisode.airingAt * 1000)
            : null
          const timeStr = airingAt
            ? `Airing at ${airingAt.getMonth() + 1}-${airingAt.getDate()}-${airingAt.getFullYear()} at ${airingAt.getHours()}:${String(airingAt.getMinutes()).padStart(2, '0')} ${getLocalTimezone()}`
            : 'Finished Airing.'
          const officialSite = show.externalLinks.find((l) => l.site === 'Official Site')

          return (
            <div
              key={show.title.native ?? show.title.romaji ?? ''}
              className="relative inline-grid text-center font-sans rounded-xl mx-6 mt-12 mb-6 w-[200px] bg-[rgb(252,214,88)] border border-cyan-600"
            >
              <a href={officialSite?.url ?? '#'} target="_blank" rel="noopener noreferrer">
                <img
                  src={show.coverImage.extraLarge ?? ''}
                  alt="Show Cover"
                  className="block mx-auto mt-2 w-[185px] h-[265px]"
                />
              </a>
              <p className="text-sm mt-1">{show.title.romaji}</p>
              <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 active:opacity-100 overflow-y-auto bg-black/80 text-white transition-opacity duration-400 w-[200px]">
                <div className="p-2.5 text-xs inline-block text-center">{timeStr}</div>
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
        {myAnimeList?.map((show) => {
          const watchedStr =
            show.airing_status === 1 && show.total_episodes === 0
              ? `Watched: ${show.watched_episodes}/?`
              : `Watched: ${show.watched_episodes}/${show.total_episodes}`
          const scoreStr = `Score: ${show.score}/10`
          const statusStr =
            show.watch_status === 1
              ? 'Currently watching.'
              : show.watch_status === 2
              ? 'Completed.'
              : 'Plan to watch.'

          return (
            <div
              key={show.mal_id}
              className="relative inline-grid text-center font-sans rounded-xl mx-6 mt-12 mb-6 w-[200px] bg-[rgb(252,214,88)] border border-cyan-600"
            >
              <a href={show.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={show.images.jpg.image_url ?? ''}
                  alt="Show Cover"
                  className="block mx-auto mt-2 w-[185px] h-[265px]"
                />
              </a>
              <p className="text-sm mt-1">{show.title}</p>
              <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 active:opacity-100 overflow-y-auto bg-black/80 text-white transition-opacity duration-400 w-[200px]">
                <div className="p-2.5 text-xs inline-block text-center">{statusStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">{watchedStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">{scoreStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">
                  <a href={show.url} className="text-white no-underline hover:text-cyan-400">MAL Link</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
