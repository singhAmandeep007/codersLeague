import React, { useState, useEffect, useRef } from 'react';
import { Container, Tab } from 'semantic-ui-react';

import isEqual from "react-fast-compare";

import CreateEditArticleForm from './../../components/createEditArticleForm';
import PreviewArticle from './../../components/previewArticle';

import './../../quill.css';
import './../../gruvbox-dark.css';

const CreateArticlePage = ({ currentUser, location }) => {

   const initialArticleData = location && location.articleData ? location.articleData : null;

   const [articleData, setArticleData] = useState(null)

   useEffect(() => {
      if (initialArticleData !== null) {
         setArticleData(initialArticleData);
      }
      console.log('inuse effect article page')
   }, [location, initialArticleData])


   const childRef = useRef();

   const handleTabChange = () => {
      const formArticleData = childRef.current.getArticleData();
      if (isEqual(articleData, formArticleData)) return;
      console.log('tab changed')
      setArticleData(formArticleData)
   }

   const panes = [
      {
         menuItem: `${!initialArticleData ? 'Create' : 'Edit'}`, pane: {
            key: "createEditArticle",
            content: (<CreateEditArticleForm
               ref={childRef}
               currentUser={currentUser}
               articleData={initialArticleData}
            />)
         }
      },
      {
         menuItem: 'Preview', pane: {
            key: "preview",
            content: (<PreviewArticle
               previewArticleData={articleData}
               userData={currentUser}
            />)
         }
      }
   ]
   return (
      <Container style={{ paddingTop: "30px" }}>
         <Tab
            panes={panes}
            renderActiveOnly={false}
            onTabChange={() => handleTabChange()}
         />
      </Container>

   )
}

export default CreateArticlePage;