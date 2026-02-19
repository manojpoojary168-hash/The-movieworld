import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
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
      const res = await axios.post('http://localhost:5000/register', form)
      setStatus({ type: 'success', message: res.data?.message || 'Registered successfully.' })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while registering.'
      setStatus({ type: 'error', message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-box">
      <h2 className="auth-title">Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Username</span>
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

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-field">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Register'}
        </button>
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

