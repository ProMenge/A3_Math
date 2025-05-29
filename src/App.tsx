import "./App.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import ImageUpload from "./components/imageUpload/imageUpload";

function App() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <Hero />
      <main className="flex-grow">
        <ImageUpload />
      </main>
      <Footer />
    </div>
  );
}

export default App;
