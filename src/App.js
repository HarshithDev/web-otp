import React from 'react';
import './App.css';

function App() {
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

  return (
    <>
      <form>
        <input is='one-time-code' autocomplete='one-time-code' required />
        <input type='submit' />
      </form>
    </>
  );
}

export default App;
