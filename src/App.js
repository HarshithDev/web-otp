import React, { useEffect, useState } from 'react';
import './App.css';

function App(ref) {
  const [formdata, setFormData] = useState({});

  if ('customElements' in window && 'OTPCredential' in window) {
    customElements.define(
      'one-time-code',
      class extends HTMLInputElement {
        connectedCallback() {
          this.abortController = new AbortController();
          this.receive();
        }
        disconnectedCallback() {
          this.abort();
        }
        abort() {
          this.abortController.abort();
        }
        async receive() {
          try {
            const content = await navigator.credentials.get({
              otp: { transport: ['sms'] },
              signal: this.abortController.signal,
            });
            this.value = content.code;
            this.dispatchEvent(new Event('autocomplete'));
          } catch (e) {
            console.error(e);
          }
        }
      },
      {
        extends: 'input',
      }
    );
  }

  // const handler = () => {
  //   console.log('clicked');
  //   document.getElementById('otpForm').submit(handleSubmit);
  // };

  useEffect(() => {
    // window.document.getElementById('xxx').addEventListener('click', handler);
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit} id='otpForm'>
        <input
          is='one-time-code'
          autocomplete='one-time-code'
          id='otp'
          className={'otp'}
          name={'otp'}
          value={formdata.otp ? formdata.otp : ''}
          onChange={handleChange}
          required
        />
        <input type='submit' id='xxx' />
      </form>
    </>
  );
}

export default App;
