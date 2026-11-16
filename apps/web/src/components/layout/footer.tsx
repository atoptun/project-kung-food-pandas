import * as stylex from '@stylexjs/stylex';

import Container from '@/components/shared/container/container';
import Icon from '@/components/shared/icon/icon';
import { breakpoints, colors, radii } from '@/styles/tokens.stylex';
import { typography } from '@/styles/typography.stylex';

import Logo from './logo';

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/goITclub/' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/goitclub/' },
  { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/c/GoIT' },
] as const;

// Values follow the Figma footer (mobile 136px / tablet & desktop 144px tall).
const styles = stylex.create({
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
    marginTop: { default: 64, [breakpoints.tablet]: 100, [breakpoints.desktop]: 120 },
    paddingBottom: { default: 16, [breakpoints.tablet]: 40 },
    color: colors.black,
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  socials: {
    display: 'flex',
    gap: 16,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  social: {
    boxSizing: 'border-box',
    display: 'grid',
    placeItems: 'center',
    width: { default: 36, [breakpoints.tablet]: 40 },
    height: { default: 36, [breakpoints.tablet]: 40 },
    borderRadius: radii.circle,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.gray,
    color: colors.black,
    backgroundColor: { default: 'transparent', ':hover': colors.lightGray },
    outlineColor: colors.black,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  divider: {
    height: 0,
    margin: 0,
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.gray,
  },
  copyright: {
    margin: 0,
    textAlign: 'center',
    color: colors.darkGray,
  },
});

function Footer() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <Container xstyle={styles.top}>
        <Logo />
        <ul {...stylex.props(styles.socials)}>
          {SOCIAL_LINKS.map(({ name, icon, href }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                {...stylex.props(styles.social)}
              >
                <Icon name={icon} size={20} />
              </a>
            </li>
          ))}
        </ul>
      </Container>

      <hr {...stylex.props(styles.divider)} />

      <p {...stylex.props(typography.main, styles.copyright)}>
        ©2024, Foodies. All rights reserved
      </p>
    </footer>
  );
}

export default Footer;
