import React from "react";
import { Accordion, Grid, Image } from "semantic-ui-react";
import LessonComponent from "./LessonComponent";
import { anonymousCall } from "../../../../../utils/ApiUtils";
import { SERVER_API } from "../../../../../config";
import { withRouter } from "react-router-dom";
import SimpleAppBar from "../SimpleAppBar";
import "./exam.css";
import { Log } from "../../../../../utils/LogUtil";

const titleWrapper = {
  flexDirection: "row",
  alignItems: "center",
  display: "flex",
  color: "#505763",
  flex: "1 1 auto",
  fontSize: "18px",
  fontWeight: "600",
  boxSizing: "border-box",
  backgroundColor: " #f9f9f9",
  border: "solid 1px #e8e9eb",
  margin: "2px"
};

class ChapterComponent extends React.Component {
  state = {
    chapters: [],
    activeIndex: 0,
    loaded: false,
    adsVertical: [],
    adsHorizontal: []
  };

  setError(error) {
    this.setState({
      error
    });
  }

  setLoading(loading) {
    this.setState({
      loading
    });
  }

  componentDidMount() {
    this.getAds()
    const subjectId = this.props.match.params.id;
    this.setLoading(true);
    anonymousCall(
      "GET",
      `${SERVER_API}/contents/${subjectId}`,
      data => {
        this.setState({
          chapters: data
        });
      },
      err => this.setError(err),
      err => this.setError(err),
      () => this.setLoading(false)
    );
  }

  handleClick = index => {
    this.setState({
      activeIndex: index === this.state.activeIndex ? -1 : index
    });
  };
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

  renderHorizontalAds() {
    if (this.state.adsHorizontal.length > 0) {
      const ads = this.state.adsHorizontal[0];
      let imgUrl = ads.linkImage;
      const desUrl = ads.linkClick;
      if (imgUrl.indexOf("https://drive.google.com") > -1) {
        //this is link drive
        //"https://drive.google.com/file/d/0B3PEcyo1cFMEX2tNQm1XTjZKR2c/view"
        //https://drive.google.com/file/d/1AziwnyUh67vhaxfVeo7G4r2RkcH7OnRY/view?usp=sharing

        const id = imgUrl.match(/\/d\/(.*)\//)[1];
        imgUrl = "https://drive.google.com/uc?export=view&id=" + id;
      }
      return (
        <a href={desUrl} target="_blank">
          <Image src={imgUrl} style={{maxHeight:'9em'}} />
        </a>
      );
    }
    return <div />;
  }

  renderVerticalAds(index) {
    const { adsVertical } = this.state;
    if (adsVertical.length > 0 && adsVertical[index]) {
      const ads = adsVertical[index];
      let imgUrl = ads.linkImage;
      const destUrl = ads.linkClick;
      if (imgUrl.indexOf("https://drive.google.com") > -1) {
        const id = imgUrl.match(/\/d\/(.*)\//)[1];
        imgUrl = "https://drive.google.com/uc?export=view&id=" + id;
      }
      return (
        <a href={destUrl} target="_blank">
          <Image src={imgUrl} />
        </a>
      );
    }
    return <div />;
  }

  render() {
    const { chapters, activeIndex } = this.state;
    if (!this.state.loaded) {
      this.setState({
        loaded: true
      });
    }
    const firstChapter = chapters.length > 0 ? chapters[0] : undefined;
    return (
      <div>
        <SimpleAppBar
          header={
            firstChapter
              ? `${firstChapter.className} - ${firstChapter.subjectName}`
              : ""
          }
        />
        <Grid centered>
          <Grid.Row>{this.renderHorizontalAds()}</Grid.Row>
          <Grid.Row>
            <Grid.Column width={2}>{this.renderVerticalAds(0)}</Grid.Column>
            <Grid.Column width={12}>
              <Accordion fluid>
                {chapters.map((item, index) => {
                  return (
                    <div key={item._id}>
                      <Accordion.Title
                        style={titleWrapper}
                        active={activeIndex === index}
                        index={index}
                        onClick={() => this.handleClick(index)}
                      >
                        <p>
                          <span
                            style={{
                              color: "#007791",
                              paddingLeft: "10px",
                              paddingRight: "10px"
                            }}
                          >
                            {activeIndex === index ? "-" : "+"}
                          </span>
                          {item.name}{" "}
                        </p>
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === index}>
                        <div style={{ marginLeft: "3em " }}>
                          <LessonComponent chapterId={item._id} />
                        </div>
                      </Accordion.Content>
                    </div>
                  );
                })}
              </Accordion>
            </Grid.Column>
            <Grid.Column width={2}>{this.renderVerticalAds(1)}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(ChapterComponent);
