import * as stylex from '@stylexjs/stylex';

import Icon from '@/components/shared/icon/icon';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { typography } from '@/styles/typography.stylex';

import { styles } from './category-card.stylex';

export type CategoryCardProps = {
  id?: string | null;
  name: string;
  image?: string | null;
  onSelect: (id: string | null) => void;
  xstyle?: stylex.StyleXStyles;
};

export function CategoryCard({ id = null, name, image, onSelect, xstyle }: CategoryCardProps) {
  const isAllCategories = !id;
  const handleClick = () => {
    onSelect(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`View recipes in ${name}`}
      {...stylex.props(styles.card, stylex.defaultMarker(), xstyle)}
    >
      {isAllCategories || !image ? (
        <div {...stylex.props(styles.allCategoriesWrapper)}>
          <h3 {...stylex.props(typography.categories, styles.allCategoriesText)}>{name}</h3>
        </div>
      ) : (
        <div {...stylex.props(styles.imageWrapper)}>
          <ResponsiveImage
            src={image}
            alt={name}
            preset={{
              mobile: 'categoryMobile',
              tablet: 'categoryTablet',
              desktop: 'categoryDesktop',
            }}
            wrapperXstyle={styles.imageWrapper}
          />
          <div {...stylex.props(styles.overlay)} />
        </div>
      )}

      {!isAllCategories && (
        <div {...stylex.props(styles.footer)}>
          <div {...stylex.props(styles.titleWrapper)}>
            <h3 {...stylex.props(typography.categories, styles.title)}>{name}</h3>
          </div>
          <span aria-hidden="true" {...stylex.props(styles.arrowButton)}>
            <Icon name="arrow-up-right" size={18} />
          </span>
        </div>
      )}
    </button>
  );
}

export default CategoryCard;
