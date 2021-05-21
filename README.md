<div align="center">

# Virtual Assistant

</div>

Virtual Assistant uses the [react-speech-recognition](https://github.com/JamesBrill/react-speech-recognition) and [react-speech-kit](https://github.com/MikeyParton/react-speech-kit) hooks to utilize the [Web Speech API](https://wicg.github.io/speech-api/) for Speech Recognition and Voice Synthesis. It combines the two hooks to enable voice command recognition and both visual and verbal feedback for commands. Users have the ability to add items to a to-do list and view that list. Items may be deleted manually.

<!-- This is my capstone project for General Assembly's Software Engineering Immersive program. -->

<br>

<div align="center">

[Live Demo](https://virtual-asst.herokuapp.com/)

</div>

<!-- ![ez-showCommands](https://user-images.githubusercontent.com/55470100/119111518-242b3380-b9f1-11eb-8982-479dfa52cdae.gif) -->

<!-- ![ez-showTodolist](https://user-images.githubusercontent.com/55470100/119111607-36a56d00-b9f1-11eb-8fac-fd79894a4b0f.gif) -->
<!--
![ez-showActivated](https://user-images.githubusercontent.com/55470100/119111659-43c25c00-b9f1-11eb-8a27-fdde8a9ff1da.gif) -->

<p align="center">
<a target="_blank" rel="noopener noreferrer" href="https://user-images.githubusercontent.com/55470100/119111659-43c25c00-b9f1-11eb-8a27-fdde8a9ff1da.gif">
<img width="350px" src="https://user-images.githubusercontent.com/55470100/119111659-43c25c00-b9f1-11eb-8a27-fdde8a9ff1da.gif" style="max-width:100%;">
</a>

<a target="_blank" rel="noopener noreferer" href="https://user-images.githubusercontent.com/55470100/119111607-36a56d00-b9f1-11eb-8fac-fd79894a4b0f.gif">
<img width="350px" src="https://user-images.githubusercontent.com/55470100/119111607-36a56d00-b9f1-11eb-8fac-fd79894a4b0f.gif" style="max-width:100%;">
</a>
</p>

<!-- ![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/55470100/118386539-22730180-b5e6-11eb-936c-a867e0a90cd2.gif) -->

![]()

<div align="center">

### Technologies Used:

---

</div>

#### Dependencies:

- [react-speech-recognition](https://github.com/JamesBrill/react-speech-recognition)
- [react-speech-kit](https://github.com/MikeyParton/react-speech-kit)
- axios

##### Backend dependencies:

- express
- mongoose
<!-- - bcryptjs
- cors
- jsonwebtoken -->

###### APIs:

- [Open Weather Map](https://openweathermap.org/api)
- [Web Speech API](https://wicg.github.io/speech-api/) (via linked libraries)

<details><summary>This project was bootstrapped with Create React App.</summary>

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

</details>

<div align="center">

### Planning Stages:

</div>

---

My original plans for the app were somewhat vague - I wasn't quite sure yet what the API could do (or what I could do with it). You can see from the wireframes (below) I had something different in mind. That being said, it was actually a really important step in the process. Figuring out how to represent voice controlled components was an interesting challenge, and one I hope to continue to expand upon in the future.

<details><summary>Original wireframes</summary>

<p align="center">
<a target="_blank" rel="noopener noreferrer" href="https://user-images.githubusercontent.com/55470100/119117484-43c55a80-b9f7-11eb-9764-6f80be6e7511.PNG">
<img width="350px" src="https://user-images.githubusercontent.com/55470100/119117484-43c55a80-b9f7-11eb-9764-6f80be6e7511.PNG" style="max-width:100%;">
</a>

<p align="center">
<a target="_blank" rel="noopener noreferrer" href="https://user-images.githubusercontent.com/55470100/119116542-5723f600-b9f6-11eb-868f-853b71d25550.PNG">
<img width="350px" src="https://user-images.githubusercontent.com/55470100/119116542-5723f600-b9f6-11eb-868f-853b71d25550.PNG" style="max-width:100%;">
</a>

<a target="_blank" rel="noopener noreferer" href="https://user-images.githubusercontent.com/55470100/119116668-76228800-b9f6-11eb-989e-715dd7eba15f.PNG">
<img width="350px" src="https://user-images.githubusercontent.com/55470100/119116668-76228800-b9f6-11eb-989e-715dd7eba15f.PNG" style="max-width:100%;">
</a>
</p>

<p align="center">
<a target="_blank" rel="noopener noreferrer" href="https://user-images.githubusercontent.com/55470100/119117400-314b2100-b9f7-11eb-87ad-74cad557bce7.PNG">
<img width="350px" src="https://user-images.githubusercontent.com/55470100/119117400-314b2100-b9f7-11eb-87ad-74cad557bce7.PNG" style="max-width:100%;">
</a>

</details>

<div align="center">

### Getting Started:

</div>

---

<!-- #### How to use/install:

- Fork and clone this repository
- [Create-react-app README.md](https://github.com/facebook/create-react-app/blob/master/README.md)
- Install any dependencies (listed [here](#dependencies:)) with `yarn add <dependency>` or `npm install <dependency>`
- `yarn start` or `npm start` should run the app locally in your browser at `http://localhost:3000`

[Link to backend repo](https://github.com/kristenprescott/VoiceAsst_backend)

- Fork and clone the server api
- Install any dependencies
- Create an account on [MongoDB Atlas]() -->

#### Making new commands:

- Commands are held in an array called "commands", located inside the VirtualAssistant component. Each command is an object with two properties:
  1. command: a string for Virtual Assistant to listen for
  2. callback: a callback function to execute in response; there is one already built-in to the react-speech-recognition hook called resetTranscript() - it resets the transcript. (I use the command "clear" or "reset" here)
- A common pattern I've used here for action commands is to:
  1. Set some state `[state, setState] = useState(default)`
  2. Write `doFunction()` to `setState(newState)`
  3. Call `doFunction()` to execute in the callback function of the new command
- To set a verbal response in a command:

  ```js
  speak({"these words will be spoken"})
  ```

- To set a written response (displayed in the message display):
  ```js
  setMessage("these words will be displayed in text");
  ```

##### Example command:

```js
    {
      command: "thank you",
      callback: () => {
        setMessage("You're welcome.");
        speak({ text: "you're welcome" });
      },
    },
```

##### More:

For more information browse these docs:

- [react-speech-recognition Docs](https://github.com/JamesBrill/react-speech-recognition/tree/98b14bfd60e7b9d72c1d6be95fdc5bfd0a5d3018/docs) (extensive and informative, highly recommend)
- [react-speech-kit Docs](https://github.com/MikeyParton/react-speech-kit) (has great examples of how to use)
- Web Speech API Docs:
  - [W3C](https://wicg.github.io/speech-api/)
  - [Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

<div align="center">

### Unsolved Problems:

</div>

---

- [ ] Make Voice Assistant global to the app - currently, components are rendered conditionally right on the Voice Assistant page
- [ ] When fetching from weather api, a fetch command must first be made (once) before any further requests can be made to the weather API

<div align="center">

### Future Enhancements:

</div>

---

- [ ] Login/registration for user-specific todo lists
- [ ] User restricted data access
- [ ] User varibale memory (for example, when you say "My name is :name", it is stored to memory)
- [ ] Delete/update todo list tasks by voice command
- [ ] Voice memo recorder
- [ ] Further utilization of command options for better command recognition
