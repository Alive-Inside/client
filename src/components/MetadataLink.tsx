export default function MetadataLink({ href, isTitle = false, children }: { href: string, isTitle?: boolean, children: any }) {
    return <a className='spotify-metadata-link' color={isTitle ? '#fff' : SPOTIFY_GREY} target='_blank' rel='noreferrer' href={href}>{children}</a>
}

const SPOTIFY_GREY = '#B3B3B3'