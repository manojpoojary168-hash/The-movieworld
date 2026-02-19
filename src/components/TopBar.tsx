import './topbar.css'

type Props = {
  username?: string
}

export function TopBar({ username = 'User' }: Props) {
  return (
    <header className="topbar" aria-label="Top bar">
      <div className="topbar__spacer" />
      <div className="topbar__right">
        <div className="topbar__pill" aria-label="Profile">
          <div className="topbar__avatar" aria-hidden="true" />
          <span className="topbar__name">{username}</span>
        </div>
      </div>
    </header>
  )
}

