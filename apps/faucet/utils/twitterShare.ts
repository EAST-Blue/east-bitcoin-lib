"use client";

export const openTwitterShare = () => {
  // Opens a pop-up with twitter sharing dialog
  var shareURL = "http://twitter.com/share?"; //url base
  //params
  var params: {
    url: string;
    text: string;
  } = {
    url: "https://eastlayer.io",
    text: "Requesting rBTC from RegNet Faucet by Eastlayer",
  };
  for (var prop in params) {
    const val: string = prop;
    shareURL += "&" + prop + "=" + encodeURIComponent(val);
    window.open(
      shareURL,
      "",
      "left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0"
    );
  }
};
