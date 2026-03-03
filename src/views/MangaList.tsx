import { useQuery } from '@tanstack/react-query'
import { caller } from '../trpc/caller'

const cardClass = 'relative inline-grid text-center font-sans rounded-xl mx-6 mt-12 mb-6 w-[200px] border border-cyan-600'

export default function MangaList() {
  const { data: myMangaList, isLoading } = useQuery({
    queryKey: ['manga.getMyList'],
    queryFn: () => caller.manga.getMyList(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">My Manga List</h1>
      <h4 className="text-sm text-gray-600">Source: myanimelist.net</h4>

      {isLoading && <p>Loading manga list...</p>}

      <div className="inline-block text-center mx-[10vw] mb-[10vh]">
        {myMangaList?.map((entry) => {
          const { node, list_status } = entry
          const chapters = node.num_chapters === 0 ? '?' : node.num_chapters
          const volumes = node.num_volumes === 0 ? '?' : node.num_volumes
          const statusStr = list_status.status === 'reading' ? 'Currently reading.'
            : list_status.status === 'completed' ? 'Completed.'
            : list_status.status === 'plan_to_read' ? 'Plan to read.'
            : 'Dropped.'
          return (
            <div key={node.id} className={cardClass} style={{ backgroundColor: node.color ?? '#F6FCFC' }}>
              <a href={`https://myanimelist.net/manga/${node.id}`} target="_blank" rel="noopener noreferrer">
                <img src={node.main_picture.large} alt="Cover" className="block mx-auto mt-2 w-[185px] h-[265px]" />
              </a>
              <p className="text-sm mt-1">{node.title}</p>
              <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 active:opacity-100 overflow-y-auto bg-black/80 text-white transition-opacity duration-400 w-[200px]">
                <div className="p-2.5 text-xs inline-block text-center">{statusStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">Read: {list_status.num_chapters_read}/{chapters} Chapters</div>
                <div className="p-2.5 text-xs inline-block text-center">Read: {list_status.num_volumes_read}/{volumes} Volumes</div>
                <div className="p-2.5 text-xs inline-block text-center">Score: {list_status.score}/10</div>
                <div className="p-2.5 text-xs inline-block text-center">
                  <a href={`https://myanimelist.net/manga/${node.id}`} className="text-white no-underline hover:text-cyan-400">MAL Link</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
