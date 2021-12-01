import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import routes from 'router/routes';
import GlobalStyle from 'assets/style/global';
import { dark as darktheme, light as lighttheme } from 'assets/style/theme';
import Loading from 'components/shared/Loading';
import { useGlobalContext } from './shared/context';
import ServerError from 'pages/500';
import NotFound from 'pages/404';
import { useEffect, useState, Suspense } from 'react';
import Dashboard from 'pages/dashboard';
import Console from 'lib/Console';
import PrivateRoute from 'router/PrivateRoute';
import Auth from 'pages/auth';

const PagesRouter = (): JSX.Element => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <PrivateRoute exact path={routes.main}>
            <Dashboard />
          </PrivateRoute>

          <Route exact path={routes.authSection}>
            <Auth />
          </Route>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  )
}


// Check the Authentication Flow used here
// https://v5.reactrouter.com/web/example/auth-workflow
function App(): JSX.Element {
  const context = useGlobalContext();
  const [serverError, setServerError] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() =>{
    // Check API and authentication status
    if(!process.env.REACT_APP_API_URL) throw new Error("API URL must be declared in the env file");

    fetch(process.env.REACT_APP_API_URL)
      .then((res) => res.json())
      .then((data) => {
        Console.log(data);
        if (!data.ok) throw new Error("Server Response not OK");

        // Check auth status here
      })
      .catch((error) => {
        Console.error(error);
        setServerError(true);
      })
      .finally(() => setInitialLoading(false));
  }, []);
  

  return (
    <ThemeProvider theme={context.state.theme === 'dark' ? darktheme : lighttheme}>
      <GlobalStyle />
      
      {
        initialLoading
          ? <Loading global hint="Reaching server..." />
          : serverError
            ? <ServerError />
            : <PagesRouter />
      }
    </ThemeProvider>
  );
}

export default App;
