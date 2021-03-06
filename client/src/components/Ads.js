import React from 'react';

const Ads = (ad) => {
  const address = ad.ad[0];
  const link = 'http://' + ad.ad[1];
  const linkName = ad.ad[2];
  const img = ad.ad[3];
  return (
    <div className="ads">
      <ul>
        <a href={link} target="_blank">
          {linkName}
        </a>
        <h4>Done by: {address}</h4>
      </ul>
      {img ? (
        <img
          className="img"
          src={`https://ipfs.infura.io/ipfs/${img}`}
          alt="Check this out!"
        />
      ) : (
        <p>Check this out!</p>
      )}
    </div>
  );
};

export default Ads;
