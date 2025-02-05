import React, { useEffect, useState } from "react";

import { Grid } from "semantic-ui-react";

import { getUserProfile } from "./../../services/userApi";

import PlaceholderCard from "./../../components/placeholderCard/placeholderCard";
import PlaceholderComment from "./../../components/placeholderComment/placeholderComment";

import UserFollowingAndFollowers from "./../../components/UserFollowingAndFollowers";
import RenderArticles from "./renderArticles";
import RenderComments from "./renderComments";

import convertIsoToDate from "./../../utils/IsoDateConvert";
import "./userProfile.css";

const UserProfilePage = ({ match, history, currentUserId }) => {
  const [data, setData] = useState({ userData: null, loading: true });

  useEffect(() => {
    getUserProfile(match.params.username).then(
      (response) => {
        setData({
          userData: {
            ...response.data.data.user,
            articleCounts: response.data.data.articleCounts,
            commentCounts: response.data.data.commentCounts,
          },
          loading: false,
        });
      },
      (err) => history.push("/error")
    );
  }, [match.params.username, history]);
  // if err or no data show user not found or deleted
  return (
    <>
      <Grid
        centered
        stackable
        relaxed
      >
        <Grid.Row>
          <Grid.Column width={14}>
            <div className="ui block center aligned header">
              {data.loading ? (
                <PlaceholderCard num={1} />
              ) : (
                data.userData && (
                  <>
                    <img
                      src={data.userData.photo}
                      className="ui circular image"
                      style={{ width: "7.5em" }}
                      alt="profile pic"
                    />
                    <br />
                    <h1 className="ui huge header">{data.userData.fullname}</h1>
                    <div>
                      <div className="sub header">{data.userData.bio}</div>
                    </div>

                    <span className="ui horizontal divider header violet">More Details</span>

                    <div
                      className="ui horizontal bulleted link list"
                      style={{ fontWeight: "100" }}
                    >
                      {data.userData.location && (
                        <span className="item">
                          <i className="map marker alternate icon"></i>
                          {data.userData.location}
                        </span>
                      )}
                      {data.userData.createdAt && (
                        <span className="item">
                          <i className="calendar alternate icon"></i>
                          {convertIsoToDate(data.userData.createdAt)}
                        </span>
                      )}
                      {data.userData.url && (
                        <span className="item">
                          <i className="linkify icon"></i>
                          <a
                            href={`${data.userData.url}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="wrapWord urlInProfile">{data.userData.url}</span>
                          </a>
                        </span>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={5}>
            {data.loading ? (
              <PlaceholderComment num={1} />
            ) : data.userData && data.userData.skills ? (
              <Grid.Row style={{ marginBottom: "20px" }}>
                <div className="ui  floating message pink">
                  <div className="header">
                    <i className=" thumbtack icon"></i>
                    Skills/languages
                  </div>
                </div>

                <div className="ui pink raised segment">
                  <div className="ui list">
                    {data.userData.skills &&
                      data.userData.skills.split(" ").map((skill, i) => {
                        return (
                          <div
                            className="item"
                            key={`${skill + i}`}
                          >
                            <i className="hashtag icon"></i>
                            <div className="content">{skill}</div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Grid.Row>
            ) : null}

            {data.loading ? (
              <PlaceholderComment num={1} />
            ) : data.userData ? (
              <Grid.Row style={{ marginBottom: "20px" }}>
                <div className="ui  floating message purple">
                  <div className="header">
                    <i className=" thumbtack icon"></i>
                    Stats
                  </div>
                </div>
                <div className="ui purple raised segment">
                  <div className="ui list">
                    <div className="item">
                      <i className="file alternate outline large icon"></i>
                      <div className="middle aligned content">
                        &nbsp;&nbsp;&nbsp;&nbsp; {data.userData.articleCounts} articles published.
                      </div>
                    </div>
                    <div
                      className="item"
                      style={{ marginTop: "5px" }}
                    >
                      <i className="comments large icon"></i>
                      <div className="middle aligned content">
                        &nbsp;&nbsp;{data.userData.commentCounts} comments written.
                      </div>
                    </div>
                  </div>
                </div>
              </Grid.Row>
            ) : null}

            {data.loading ? (
              <PlaceholderComment num={1} />
            ) : currentUserId && currentUserId === data.userData.id ? (
              <Grid.Row>
                <div className="ui  floating message yellow">
                  <div className="header">
                    <i className=" thumbtack icon"></i>
                    Following & Followers
                  </div>
                </div>

                <div className="ui yellow raised segment">
                  <UserFollowingAndFollowers />
                </div>
              </Grid.Row>
            ) : null}
          </Grid.Column>

          <Grid.Column width={9}>
            {data.loading ? (
              <PlaceholderCard num={2} />
            ) : data.userData && data.userData.articles && data.userData.articles.length > 0 ? (
              <Grid.Row style={{ marginBottom: "20px" }}>
                <div className="ui  floating message teal">
                  <div className="header">
                    <i className=" thumbtack icon"></i>
                    Recent Articles
                  </div>
                </div>
                <RenderArticles
                  articles={data.userData.articles}
                  userId={data.userData.id}
                />
              </Grid.Row>
            ) : null}

            {data.loading ? (
              <PlaceholderComment num={5} />
            ) : data.userData && data.userData.comments && data.userData.comments.length > 0 ? (
              <Grid.Row>
                <div className="ui floating message olive">
                  <div className="header">
                    <i className=" thumbtack icon"></i>
                    Recent Comments
                  </div>
                </div>
                <RenderComments
                  comments={data.userData.comments}
                  userId={data.userData.id}
                />
              </Grid.Row>
            ) : null}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default UserProfilePage;
