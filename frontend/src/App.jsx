import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Header, Footer } from "./Fragments";
import Publico from "./publico/Publico";

function App() {

    return (

        <BrowserRouter>

            <Header />

            <main>

                <Routes>

                    <Route path="/" element={<Publico />} />

                </Routes>

            </main>

            <Footer />

        </BrowserRouter>
    );
}

export default App;