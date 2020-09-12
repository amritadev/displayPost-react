
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PageDisplay from '../post/PostDisplay';
import PostDetail from '../post/PostDetetails';

class Router extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
           <Route path="/" component={PageDisplay} exact />
            <Route path="/post-detail/:id" component={PostDetail} />
            {/*  <Route path="/post/:id" component={Postsearch}/> */}
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default Router;