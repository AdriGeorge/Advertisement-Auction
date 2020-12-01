import React from 'react';

const Ads = (ad) => {
  const address = ad.ad[0];
  const link = ad.ad[1];
  const linkName = ad.ad[2];
  return (
    <div className="ads">
      <ul>
        <a href={link}>{linkName}</a>
        <h4>Done by: {address}</h4>
      </ul>
    </div>
  );
};

export default Ads;
