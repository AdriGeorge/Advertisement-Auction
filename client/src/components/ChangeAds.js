import React, { useState } from 'react';

const ChangeAds = ({ changeAd, cost }) => {
  const costToShow = Math.round((cost + 0.1) * 10) / 10;
  console.log(costToShow);
  const [link, setLink] = useState('');
  const [nameLink, setNameLink] = useState('');
  const [value, setValue] = useState(cost + 0.1);

  const changeAdAndReset = (e) => {
    e.preventDefault();
    changeAd(e, link, nameLink, value);
    setLink('');
    setNameLink('');
    setValue(cost + 0.2);
  };
  return (
    <div className="change">
      <form onSubmit={(e) => changeAdAndReset(e)}>
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
          min={costToShow}
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
      <p>The minimum cost for add a new ADVERTISEMENT is {costToShow} ETH</p>
    </div>
  );
};

export default ChangeAds;
