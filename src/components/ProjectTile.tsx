interface Project {
  link: string
  projectName: string
  description: string
  language: string
}

const projects: Project[] = [
  {
    link: 'https://github.com/chrisfernandes18/Command-Line-MAL',
    projectName: 'Command Line MAL',
    description: 'Search MyAnimeList.net from the command line and save searches into a csv file.',
    language: 'Python',
  },
  {
    link: 'https://github.com/chrisfernandes18/Jisho',
    projectName: 'Jisho',
    description: 'Search up Japanese words on https://www.jisho.org from the command line.',
    language: 'Python',
  },
  {
    link: 'https://github.com/chrisfernandes18/Connect4',
    projectName: 'Connect 4',
    description: 'Play Connect 4 on your computer.',
    language: 'Python',
  },
  {
    link: 'https://github.com/chrisfernandes18/functional-project',
    projectName: 'Checkers',
    description: 'Play checkers in a browser.',
    language: 'Elm',
  },
]

export default function ProjectTile() {
  return (
    <>
      {projects.map(({ link, projectName, description, language }) => (
        <a
          key={projectName}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <div className="relative inline-grid bg-[#f5f6ff] rounded-xl shadow-md w-48 h-48 p-6 mx-6 mt-12 mb-6 text-center font-sans transition-all duration-500">
            <h3 className="text-cyan-600 text-center">{projectName}</h3>
            <p className="absolute top-20 left-0 mx-4 text-black text-sm">{description}</p>
            <div className="absolute left-0 bottom-0 w-full text-left">
              <span className="font-mono text-[#3e3e49] text-xs font-light tracking-wide px-2 pb-2 block">
                {language}
              </span>
            </div>
            <div className="absolute left-0 bottom-0 w-full h-2.5 bg-cyan-600 rounded-b-xl" />
          </div>
        </a>
      ))}
    </>
  )
}
