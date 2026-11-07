import React from 'react';
import { ArabicNumber } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';

/**
 * Breadcrumbs — one implementation for both the unit page and the lesson shell.
 *
 * Before this component there were two divergent copies (`.breadcrumbs` in
 * UnitPage and `.lesson-breadcrumbs` in LessonShell). Both class names are kept
 * so existing selectors keep matching; only the markup source is unified.
 */
export interface BreadcrumbItem {
  label: React.ReactNode;
  onClick?: () => void;
  /** Renders as plain text; combined with `aria-current`. */
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Kept for compatibility with the two legacy class names. */
  variant?: 'page' | 'lesson';
  label?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  variant = 'page',
  label = 'مسار التنقل',
}) => (
  <nav
    className={`breadcrumbs ${variant === 'lesson' ? 'lesson-breadcrumbs' : ''}`.trim()}
    aria-label={label}
  >
    <span className="breadcrumb-home-icon" aria-hidden="true">
      {/* A tiny separator glyph keeps the trail scannable without a second icon set. */}
      ‹
    </span>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <React.Fragment key={index}>
          {item.onClick && !item.current ? (
            <button type="button" className="breadcrumb-link" onClick={item.onClick}>
              {item.label}
            </button>
          ) : (
            <span className="breadcrumb-current" aria-current={item.current || isLast ? 'page' : undefined}>
              {item.label}
            </span>
          )}
          {!isLast && (
            <span className="breadcrumb-separator" aria-hidden="true">
              ‹
            </span>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

/**
 * PageHeader — the shared hero for the home / unit / lesson surfaces.
 * It carries: a kicker line, the title, optional meta chips and an action slot.
 * Everything it renders comes from project data; no copy is invented here.
 */
export interface PageHeaderMeta {
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** `true` renders the chip with a stronger, "primary" treatment. */
  emphasis?: boolean;
}

export interface PageHeaderProps {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  /** Printed subtitle from the registry (`metadata.subtitle`), never rewritten. */
  subtitle?: React.ReactNode;
  meta?: PageHeaderMeta[];
  actions?: React.ReactNode;
  /** 1 = page title, 2 = section title. */
  level?: 1 | 2;
  variant?: 'plain' | 'hero';
  id?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  subtitle,
  meta,
  actions,
  level = 1,
  variant = 'plain',
  id,
}) => {
  const Heading = (level === 1 ? 'h1' : 'h2') as 'h1' | 'h2';
  return (
    <header className={`page-header page-header--${variant}`}>
      <div className="page-header-copy">
        {kicker && <span className="page-header-kicker">{kicker}</span>}
        <Heading className="page-header-title" id={id}>
          {title}
        </Heading>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        {meta && meta.length > 0 && (
          <ul className="page-header-meta">
            {meta.map((item, index) => (
              <li key={index} className={`meta-chip${item.emphasis ? ' meta-chip--emphasis' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
};

/**
 * SectionHeading — the section title row used by the home and unit pages.
 * `count` renders an Arabic-Indic numeral so the count is never a bare latin digit.
 */
export interface SectionHeadingProps {
  title: React.ReactNode;
  count?: number;
  countLabel?: string;
  hint?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  count,
  countLabel,
  hint,
  id,
  action,
}) => (
  <div className="section-heading">
    <div className="section-heading-copy">
      <h2 id={id} className="section-heading-title">
        {title}
      </h2>
      {hint && <p className="section-heading-hint">{hint}</p>}
    </div>
    <div className="section-heading-side">
      {typeof count === 'number' && (
        <span className="section-heading-count">
          <ArabicNumber value={toArabicDigits(count)} /> {countLabel}
        </span>
      )}
      {action}
    </div>
  </div>
);

/**
 * StatusPill — never encodes state by colour alone: it always pairs an icon
 * with a word. Used for "available / saved position / locked" states.
 */
export interface StatusPillProps {
  tone: 'brand' | 'teal' | 'warm' | 'ok' | 'warn' | 'neutral';
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Adds a subtle dot marker; purely decorative, the label carries meaning. */
  dotted?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ tone, icon, children, dotted }) => (
  <span className={`status-pill status-pill--${tone}`}>
    {icon}
    {dotted && <span className="status-pill-dot" aria-hidden="true" />}
    {children}
  </span>
);

/**
 * EmptyState — replaces the seven inline copies that used to live in App.tsx.
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="empty-state-card">
    {icon && (
      <span className="empty-state-icon" aria-hidden="true">
        {icon}
      </span>
    )}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action}
  </div>
);
