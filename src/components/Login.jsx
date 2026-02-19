import { useState } from 'react'

export default function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const message = data.error || 'Login failed.'
        setStatus({ type: 'error', message })
      } else {
        const username = data.username || form.username
        window.localStorage.setItem('username', username)
        setStatus({ type: 'success', message: data.message || 'Login successful' })
        // Redirect to home page after brief delay
        setTimeout(() => {
          window.location.href = 'https://the-movieworld.vercel.app/'
        }, 1000)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong while logging in.'
      setStatus({ type: 'error', message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-box auth-box--primary">
      <h2 className="auth-title">Sign In</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email or mobile number</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button className="auth-button auth-button--primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>

        <div className="auth-row">
          <label className="auth-checkbox">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="auth-linkButton"
            onClick={() => {
              setStatus({ type: '', message: '' })
            }}
          >
            Forgot Password?
          </button>
        </div>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={() => {
            setStatus({ type: '', message: '' })
          }}
        >
          Use a sign-in code
        </button>

        <p className="auth-muted">
          New to Netflix? <span className="auth-link">Sign up now</span>
        </p>

        <p className="auth-caption">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.
        </p>

      </form>

      {status.message && (
        <p
          className={`auth-message ${
            status.type === 'success' ? 'auth-message--success' : 'auth-message--error'
          }`}
        >
          {status.message}
        </p>
      )}
    </section>
  )
}

