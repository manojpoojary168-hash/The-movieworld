import './sidebar.css'
import { IconBell, IconHome, IconSearch } from './icons'

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar__brand" aria-label="Brand">
        <span className="sidebar__brandMark">N</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navigation">
        <a className="sidebar__item sidebar__item--active" href="#" aria-label="Home">
          <IconHome />
        </a>
        <a className="sidebar__item" href="#" aria-label="Search">
          <IconSearch />
        </a>
        <a className="sidebar__item" href="#" aria-label="Notifications">
          <IconBell />
        </a>
      </nav>
    </aside>
  )
}

