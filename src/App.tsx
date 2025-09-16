import { useState, useEffect } from 'react'
import './App.css'
const initialArticles:any = [{title:'ONE'},{title:'TWO'},{title:'THREE'}]



function App() {
  // For storing the article data
  const [articles, setArticles] = useState(initialArticles);
  // For storing the selected article id
  const [selectedArticleId, setSelectedArticleId] = useState(-1);

  // Initial form object to intitialise the forObject state variable
  const initialFormObject: any = {title: 'title1', content: 'content1'};
  // For storing the form data
  const [formObject, setFormObject] = useState(initialFormObject);

  // Function to retrieve the articles from articles.json over the network
  const getArticles = function(){
    fetch('articles.json')
      .then(response => response.json())
      .then( data => {
        setArticles(data)
      });
  };

  // Use Effect Statement
  useEffect(() => {getArticles()}, []); // Empty square brackets ensures the code is only called once - after first render


  // Get the selected articles content, or none if no article is selected
  const selectedArticle = (articles[selectedArticleId]) ? articles[selectedArticleId].content : 'none';

  // When an article is selected, populate the form fields with its data
  useEffect(() => {
    // If the selected article id is valid, populate the form fields with its data
    if (validSelectedArticleId()) {
      // Populate the form fields with the selected article's data
      setFormObject({
        title: articles[selectedArticleId].title || '',
        content: articles[selectedArticleId].content || ''
      });
    } else {
      // If no valid article is selected, reset the form fields to initial values
      setFormObject(initialFormObject);
    }
  }, [selectedArticleId, articles]);

  // Get a new value for the field being changed andassign it to the property of the same name in formObject
  const changeHandler = function(event: any) {
    const name = event.target.name;
    const value = event.target.value;
    formObject[name] = value;
    setFormObject({...formObject});
  }

  // Function to disable/enable delete button, returns true if the selected article is greater than -1 (-1 was the default)
  const validSelectedArticleId = function() {
    return (selectedArticleId >= 0 && selectedArticleId < articles.length);
  }

  // Function to delete the selected article
  const deleteSelected = function () {
    if (validSelectedArticleId()) {
      articles.splice(selectedArticleId, 1);
      setArticles([...articles]);
  }
  }



  return (
    <div className={'app'}>
      <h2>React Hooks App</h2>

      {/* Display a list of articles, as links, that were retrieved from articles.json */}
      <ul>
        {articles.map((article: any, index: number) => (
          // When the list item is clicked, it will apply the 'selected' css styling
          <li key={index} className={(selectedArticleId == index) ? 'selected' : ''} onClick={(_) => setSelectedArticleId(index)}>
            {article.title}
          </li>
        ))}
      </ul>

      {/* Display the selected article content */}
      <br/><span className={'bold'}>Selected Article: </span>
      <p>{selectedArticle}</p>
      
      <div className={'controls'}>
        <span className={'bold'}>Controls</span><br/>
        <button onClick={() => setArticles([...articles, formObject])}>Add Article</button>&nbsp;
        <button disabled={!validSelectedArticleId()} onClick={() => deleteSelected()}>Delete Selected</button>
        <button disabled={!validSelectedArticleId()} onClick={() => {
          if (validSelectedArticleId()) {
            const updatedArticles = [...articles];
            updatedArticles[selectedArticleId] = { ...formObject };
            setArticles(updatedArticles);
          }
        }}>Update Article</button>
        <br />
        <input type={'text'} name={'title'} placeholder={'title'} value={formObject.title} onChange= {(e)=>changeHandler(e)}/>
        <br />
        <input type={'text'} name={'content'} placeholder={'content'} value={formObject.content} onChange= {(e)=>changeHandler(e)}/>
        <br />
      </div>

    </div>
  );

}

export default App
