import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Quiz } from './components/Quiz';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/take-quiz/:id' component={Quiz} />
        <Route path='/new-quiz' component={FetchData} />
      </Layout>
    );
  }
}