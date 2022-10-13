import { MainPage } from "./pages";
import './styles/all.css';

const contentNode = document.querySelector('#content');

async function initialize () {
  const page = new MainPage();
  const element = await page.render();

  contentNode.innerHTML = '';
  contentNode.append(element);
}

initialize();