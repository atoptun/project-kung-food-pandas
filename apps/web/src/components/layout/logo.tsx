import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router';

import { logo } from './header.stylex';

type LogoProps = {
  onClick?: () => void;
};

function Logo({ onClick }: LogoProps) {
  return (
    <Link to="/" aria-label="Foodies home" onClick={onClick} {...stylex.props(logo.link)}>
      foodies
    </Link>
  );
}

export default Logo;
