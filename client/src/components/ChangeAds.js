import React, { useState } from 'react';

const ChangeAds = ({ changeAd, cost }) => {
  console.log(cost);
  const [link, setLink] = useState('');
  const [nameLink, setNameLink] = useState('');
  const [value, setValue] = useState(cost + 0.1);
  return (
    <div className="change">
      <form onSubmit={(e) => changeAd(e, link, nameLink, value)}>
        <input
          className="input"
          type="text"
          value={link}
          placeholder="link"
          onChange={(e) => setLink(e.target.value)}
        ></input>
        <input
          className="input"
          type="text"
          value={nameLink}
          placeholder="name of your Link"
          onChange={(e) => setNameLink(e.target.value)}
        ></input>
        <br />
        <input
          className="input-value"
          type="number"
          step="0.1"
          min={cost + 0.1}
          id="amount"
          name="amount"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></input>
        eth
        <br />
        <button className="btn">
          <span>Set your Ad</span>
        </button>
      </form>
      <p>The minimum cost for add a new ADVERTISEMENT is {cost + 0.1}</p>
    </div>
  );
};

export default ChangeAds;
