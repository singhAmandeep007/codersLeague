import React from 'react';
import { Link } from "react-router-dom";
import convertIsoToDate from './../../utils/IsoDateConvert';
import { Card, Icon, Image, Button, Label } from 'semantic-ui-react';

import './articleCard.css';

class ArticleCard extends React.Component {

   render() {

      const {
         _id,
         slug,
         clapCounts,
         commentCounts,
         createdAt,
         expertiseLevel,
         tags,
         title,
         user,
         shortDescription
      } = this.props;

      return (
         <Card fluid raised>

            <Card.Content >

               <Image
                  floated='left'
                  size="mini"
                  src={user.photo}
                  alt={user.username}
               />

               <Card.Meta>
                  <Link to={`/u/${user.username}`} className='userName'>{user.fullname}</Link>
                  <br />
                  <span style={{ fontSize: '0.9rem', lineHeight: '1em' }}>{convertIsoToDate(createdAt)}</span>
               </Card.Meta>

               <Card.Description >
                  <span className={`ui ribbon  label ${expertiseLevel === 'advanced' ? "red" : (expertiseLevel === 'intermediate') ? "orange" : "blue"}`}>{expertiseLevel}</span>


                  <h2 className="ui header articleHeader">
                     <Link to={`/u/${user.username}/a/${slug}`}>{title} </Link>

                     <div className="sub header articleSubHeader">{shortDescription}</div>
                  </h2>

                  <div className="ui black labels">
                     {tags.map(tag => {
                        return <span key={tag} className="ui mini  label"># {tag}</span>
                     })}
                  </div>
               </Card.Description>

            </Card.Content>


            <Card.Content extra>

               <Button as='div' labelPosition='right' size="tiny">
                  <Button color='red' compact style={{ paddingRight: "0.533em" }}>
                     <Icon name='heart' />
                  </Button>
                  <Label as='a' basic color='red' >
                     {clapCounts}
                  </Label>
               </Button>

               <Button as='div' labelPosition='right' size="tiny" >
                  <Button color='blue' compact style={{ paddingRight: "0.533em" }}>
                     <Icon name='comment' />
                  </Button>
                  <Label as='a' basic color='blue' >
                     {commentCounts}
                  </Label>
               </Button>

               <Button animated floated='right' size="tiny">
                  <Button.Content visible>Save</Button.Content>
                  <Button.Content hidden>
                     <Icon name='bookmark' />
                  </Button.Content>
               </Button>

            </Card.Content>
         </Card>
      )
   }

}

export default ArticleCard;