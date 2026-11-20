import * as stylex from '@stylexjs/stylex';
import { type KeyboardEvent, type ReactNode, useId, useRef } from 'react';

import type { ProfileTab, ProfileTabOption } from '../profile.constants';
import { getNextTabIndex } from '../profile.utils';
import { styles } from './profile-tabs.stylex';

export default function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
}: {
  tabs: readonly ProfileTabOption[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  children: ReactNode;
}) {
  const prefix = useId();
  const panelId = `${prefix}-panel`;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = getNextTabIndex(event.key, index, tabs.length);
    if (nextIndex === undefined) return;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;

    event.preventDefault();
    onTabChange(nextTab.id);
    const nextButton = tabRefs.current[nextIndex];
    nextButton?.focus();
    nextButton?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  return (
    <>
      <div role="tablist" aria-label="Profile sections" {...stylex.props(styles.tabs)}>
        {tabs.map(({ id, label }, index) => (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${prefix}-${id}`}
            aria-selected={activeTab === id}
            aria-controls={panelId}
            tabIndex={activeTab === id ? 0 : -1}
            {...stylex.props(styles.tab, activeTab === id && styles.active)}
            onClick={() => onTabChange(id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={`${prefix}-${activeTab}`} tabIndex={0}>
        {children}
      </div>
    </>
  );
}
