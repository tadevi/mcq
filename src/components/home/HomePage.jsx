import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import AppBar from "./AppBar";
import { SERVER_API } from "../../config";
import { anonymousCall, getAds } from "../../utils/ApiUtils";
import "../../App.css";
import { Log } from "../../utils/LogUtil";
import { Grid, Ref, Rail, Sticky } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

class HomePage extends Component {
  state = {
    homepage: "<div/>",
    menu: [],
    adsVertical: [],
    adsHorizontal: []
  };

  componentDidMount() {
    this.getHomePage();
    this.getAds();
  }

  getAds() {
    anonymousCall(
      "GET",
      `${SERVER_API}/qc`,
      data => {
        this.setState({
          adsVertical: data.vertical,
          adsHorizontal: data.horizontal
        });
      },
      err => Log(err),
      err => Log(err),
      () => {}
    );
  }

  getHomePage() {
    anonymousCall(
      "GET",
      `${SERVER_API}/homepage`,
      data =>
        this.setState({
          homepage: data
        }),
      err => Log(err),
      err => Log(err),
      () => {}
    );
  }

  componentWillUnmount() {
    window.runOne = undefined;
  }

  renderEmbedded() {
    setTimeout(() => {
      if (!window.runOne) {
        document.querySelectorAll("oembed[url]").forEach(element => {
          // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
          // to discover the media.
          const anchor = document.createElement("a");
          anchor.setAttribute("href", element.getAttribute("url"));
          anchor.className = "embedly-card";

          element.appendChild(anchor);
        });
        window.runOne = true;
      }
    }, 1000);
    return <div />;
  }

  renderHorizontalAds() {
    if (this.state.adsHorizontal.length > 0) {
      const ads = this.state.adsHorizontal[0];
      let imgUrl = ads.linkImage
      const desUrl = ads.linkClick;
      if (imgUrl.indexOf("https://drive.google.com") > -1) {
        //this is link drive
        //"https://drive.google.com/file/d/0B3PEcyo1cFMEX2tNQm1XTjZKR2c/view"
        //https://drive.google.com/file/d/1AziwnyUh67vhaxfVeo7G4r2RkcH7OnRY/view?usp=sharing

        const id = imgUrl.match(/\/d\/(.*)\//)[1];
        imgUrl = "https://drive.google.com/uc?export=view&id=" + id;
      }
      return (
        <a href={desUrl}>
          <Image src={imgUrl} style={{maxHeight:'8em', width:'60%'}} />
        </a>
      );
    }
    return <div />;
  }

  renderVerticalAds(index) {
    const { adsVertical } = this.state;
    if (adsVertical.length > 0 && adsVertical[index]) {
      const ads = adsVertical[index];
      let imgUrl = ads.linkImage
      const destUrl = ads.linkClick;
      if (imgUrl.indexOf("https://drive.google.com") > -1) {
        const id = imgUrl.match(/\/d\/(.*)\//)[1];
        imgUrl = "https://drive.google.com/uc?export=view&id=" + id;
      }
      return (
        <a href={destUrl}>
          <Image src={imgUrl} style={{maxWidth:'8em', height:'100%'}} />
        </a>
      );
    }
    return <div />;
  }

  render() {
    let content = "";
    if (typeof this.state.homepage === "string") content = this.state.homepage;
    return (
      <div style={{ marginTop: "3.2em" }}>
        <AppBar />
        <Grid centered >
          <Grid.Row>
            {this.renderHorizontalAds()}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={2} verticalAlign='middle'>
              {this.renderVerticalAds(0)}
            </Grid.Column>
            <Grid.Column width={12}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Grid.Column>
            <Grid.Column width={2} verticalAlign='middle'>{this.renderVerticalAds(1)}</Grid.Column>
          </Grid.Row>
        </Grid>
        {this.renderEmbedded()}
      </div>
    );
  }
}

export default withCookies(withRouter(HomePage));
