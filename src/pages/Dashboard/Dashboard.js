// import Nav from "../../components/Nav";
import Header from "../../components/Header";

export default function Dashboard() {
  //
  return (
    <div className="page">
      {/* <Nav /> */}
      <Header />
      <h1>Dashboard</h1>
      <h3 className="page__body">
        Welcome to the {`<PrivateRoute/>`} component
      </h3>
    </div>
  );
}
