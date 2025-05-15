import { css } from '@emotion/css'

const buttonStyle = css`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`

export const Button = ({ text, onClick }) => (
  <button 
    className={buttonStyle}
  >
    {text}
  </button>
)
