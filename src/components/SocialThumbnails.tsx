import fb from '../assets/icons/facebook-icon.svg'
import gh from '../assets/icons/github-icon.svg'
import ig from '../assets/icons/instagram-icon.png'
import li from '../assets/icons/linkedin-icon.svg'

const socials = [
  { icon: fb, link: 'https://www.facebook.com/christian.bjerre.fernandes', altText: 'Facebook Icon' },
  { icon: gh, link: 'https://github.com/chrisfernandes18', altText: 'Github Icon' },
  { icon: ig, link: 'https://www.instagram.com/chrispoof', altText: 'Instagram Icon' },
  { icon: li, link: 'https://www.linkedin.com/in/christian-bjerre-fernandes', altText: 'Linkedin Icon' },
]

export default function SocialThumbnails() {
  return (
    <>
      {socials.map(({ icon, link, altText }) => (
        <li key={altText} className="inline-block mx-[1vw] my-[3vh]">
          <a href={link} className="block text-center no-underline">
            <img src={icon} width={50} height={50} alt={altText} />
          </a>
        </li>
      ))}
    </>
  )
}
