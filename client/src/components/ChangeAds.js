import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import useStyles from './style';

const ChangeAds = ({ changeAd, cost }) => {
  const classes = useStyles();
  const costToShow = Math.round((cost + 0.1) * 10) / 10;
  console.log(costToShow);
  const [link, setLink] = useState('');
  const [nameLink, setNameLink] = useState('');
  const [value, setValue] = useState(cost + 0.1);
  const [img, setImg] = useState('');

  const changeAdAndReset = (e) => {
    e.preventDefault();
    changeAd(e, link, nameLink, value);
    setLink('');
    setNameLink('');
    setValue(cost + 0.2);
  };
  return (
    <div className="change">
      <Paper className={classes.paper}>
        <form
          className={`${classes.root} ${classes.form}`}
          onSubmit={(e) => changeAdAndReset(e)}
        >
          <Typography variant="h6">Insert your Ads</Typography>
          <TextField
            name="link"
            variant="outlined"
            label="Link"
            fullWidth
            value={link}
            placeholder="link"
            onChange={(e) => setLink(e.target.value)}
          ></TextField>
          <TextField
            name="title"
            variant="outlined"
            label="Title"
            fullWidth
            value={nameLink}
            onChange={(e) => setNameLink(e.target.value)}
          ></TextField>
          How many ETH you want to pay?
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
          <div className={classes.fileInput}>
            <FileBase
              type="file"
              multiple={false}
              onDone={({ base64 }) => setImg(base64)}
            />
          </div>
          <br />
          <Button
            className={classes.buttonSubmit}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Paper>
      <p>The minimum cost for add a new ADVERTISEMENT is {costToShow} ETH</p>
    </div>
  );
};

export default ChangeAds;
