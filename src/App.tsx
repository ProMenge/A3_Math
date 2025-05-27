import "./App.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import ImageUpload from "./components/imageUpload/imageUpload";

function App() {
  return (
    <>
      <Header></Header>
      <Hero />
      <ImageUpload />
      <Footer/>
    </>
  );
}

export default App;
