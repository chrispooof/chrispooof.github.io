import finnJake from '../assets/adventuretime/finn_jake.png'
import resume from '../assets/resume/christianbjerre-fernandes.pdf'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Christian Bjerre-Fernandes</h1>
      <img src={finnJake} width={250} height={200} alt="Finn and Jake Adventure Time" className="mx-auto my-4" />
      <div className="inline-block">
        <p className="text-justify text-black inline-block px-[20vw] my-4 text-lg">
          Hello! My name is Christian Bjerre-Fernandes. I studied Computer Science at the{' '}
          <a href="https://www.uchicago.edu/" className="no-underline text-cyan-600">University of Chicago</a>{' '}
          and graduated in 2021. I love to study languages and learn about other cultures. 
          I took Japanese and Norwegian during college and continue to study Japanese even now.
          <br /><br />
          I am currently a Senior Associate Software Engineer at Capital One with an AWS Solutions Architect certification. 
          I work as a full-stack developer and data engineer on Capital One's{' '}
          <a href="https://www.capitalone.com/software/products/slingshot/" className="no-underline text-cyan-600">Slingshot</a> 
          {' '}SaaS product. 
          <br /><br />
          Outside of work, I love to play RPGs like Elden Ring and other souls-like games in addition to battle royale's like Apex Legends (I main Horizon).
          I love watching movies (The Prestige, Lincoln Lawyer, etc. to name a few) and shows of
          all kind (Bojack Horseman, Love is Blind, etc.), photography, reading all sorts of things (manga, comics,
          fiction, etc.), and pickleball/biking.
          <br /><br />
          <a href={resume} target="_blank" rel="noreferrer" className="no-underline text-cyan-600">Here</a> is my resume!
        </p>
      </div>
    </div>
  )
}
