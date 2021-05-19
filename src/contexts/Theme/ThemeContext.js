const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
}
/////////////////////////////////////////////////////////
/*
function ChildComponent() {
  return <GrandChildComponent />
}
*/

/*
In order to use context in a function component you no longer need to wrap your JSX in a consumer. Instead all you need to do is pass your context to the useContext hook and it will do all the magic for you. Here is an example.

function GrandChildComponent() {
  const { theme, setTheme } = useContext(ThemeContext)

  return (
    <>
      <div>The theme is {theme}</div>
      <button onClick={() => setTheme('light')}>
        Change To Light Theme
      </button>
    </>
  )
}
*/
